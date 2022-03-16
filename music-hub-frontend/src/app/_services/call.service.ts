import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  connection: WebSocket;
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  stream: MediaStream;
  videoElement: ElementRef;
  remoteStream = new MediaStream();
  meetingId: string;
  pingPongId: any;

  constraints = {
    video: true,
    audio: true
  };

  setVideoElement(vElement) {
    this.videoElement = vElement;
  }

  setMeetingId(id) {
    this.meetingId = id;
  }

  constructor() {
    console.log('Constructor called!');

    this.initializeConnection();
    const configuration = null;
    this.peerConnection = new RTCPeerConnection(configuration);
    this.dataChannel = this.peerConnection.createDataChannel('dataChannel');
    this.dataChannel.onerror = (error) => console.log(error);
    this.dataChannel.onclose = () => console.log('Data channel is closed');
    this.dataChannel.onmessage = (event) => console.log('message:', event.data);
    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
    };

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.send({
          event: 'candidate',
          data: {
            data: event.candidate,
            meeting_id: this.meetingId
          }
        });
      }
    };

    navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
      this.stream = stream;
    }).catch((error) => {
      console.log('Stream error: ', error);
    });
  }

  createOffer(remoteVideo) {
    console.log('Creating offer');
    this.getStreams(remoteVideo).then();

    this.peerConnection.createOffer().then(offer => {
      this.send({
        event: 'offer',
        data: {
          meeting_id: this.meetingId,
          data: offer
        }
      });
      this.peerConnection.setLocalDescription(offer).then();
    }).catch(error => {
      console.log(error);
    });
  }

  sendDisconnectMessage() {
    this.send({
      event: 'disconnect',
      data: {
        data: 'disconnect',
        meeting_id: this.meetingId
      }
    });
  }

  handleOffer(offer, remoteVideo) {
    console.log('Handling offer');
    this.getStreams(remoteVideo).then();
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).then();
    this.peerConnection.createAnswer().then(answer => {
      this.peerConnection.setLocalDescription(answer).then();
      this.send({
        event: 'answer',
        data: {
          data: answer,
          meeting_id: this.meetingId
        }
      });
    });
  }

  handleCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).then();
  }

  handleAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer)).then();
    console.log('connections established successfully');
  }

  send(message) {
    if (this.connection.readyState === WebSocket.CLOSED) {
      this.initializeConnection();
    }
    console.log(message);
    this.connection.send(JSON.stringify(message));
  }

  async getStreams(remoteVideo: ElementRef) {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    console.log(remoteVideo);
    remoteVideo.nativeElement.srcObject = this.remoteStream;

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };

    this.stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.stream);
    });
  }

  private initializeConnection() {
    this.connection = new WebSocket(environment.callUrl);
    this.connection.onopen = () => {
      console.log('Connection opened!');
    };
    this.connection.onclose = () => {
      console.log('Connection closed!');
      this.initializeConnection();
    };

    this.connection.onmessage = (msg) => {
      console.log('Got message', msg.data);
      const content = JSON.parse(msg.data);
      const data = content.data.data;
      if (content.data.meeting_id === this.meetingId) {
        switch (content.event) {
          // when somebody wants to call us
          case 'offer':
            this.handleOffer(data, this.videoElement);
            break;
          case 'answer':
            this.handleAnswer(data);
            break;
          // when a remote peer sends an ice candidate to us
          case 'candidate':
            this.handleCandidate(data);
            break;
          case 'disconnect':
            this.videoElement.nativeElement.srcObject = null;
            break;
          default:
            break;
        }
      }
    };
  }

  private sendPingMessage() {
    this.connection.send('ping');
  }

  startMeeting() {
    this.pingPongId = setInterval(() => this.sendPingMessage(), 1000);
  }

  stopMeeting() {
    if (this.pingPongId) {
      clearInterval(this.pingPongId);
    }
  }

}
