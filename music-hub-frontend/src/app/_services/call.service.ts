import {ElementRef, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  connection: WebSocket = null;
  peerConnection: RTCPeerConnection = null;
  dataChannel: RTCDataChannel = null;
  stream: MediaStream;
  videoElement: ElementRef;
  remoteStream = new MediaStream();
  meetingId: string;
  pingPongId: any;
  offerId: any;
  isCalling: boolean;

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
  }

  initialize() {
    this.pingPongId = setInterval(() => this.sendPingMessage(), 1000);
    if (this.peerConnection != null) {
      this.peerConnection.close();
    }

    timer(500).subscribe(() => {
      this.initializeRtcPeerConnection();
    });
    timer(3000).subscribe(() => {
      this.startSendingOffers(this.videoElement);
    });
  }

  initializeRtcPeerConnection() {
    const configuration: RTCConfiguration = {
      iceServers: [{
        urls: 'stun:stun4.l.google.com:19302',
      },
        {
          urls: 'turn:relay.backups.cz',
          username: 'webrtc',
          credential: 'webrtc',
        }]
    };
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
        console.log('ice candidate');
        this.send({
          event: 'candidate',
          data: {
            data: event.candidate,
            meeting_id: this.meetingId
          }
        });
      }
    };
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

  startSendingOffers(remoteVideo) {
    console.log('Creating offer');
    this.getStreams(remoteVideo).then();
    this.offerId = setInterval(() => this.createOffer(remoteVideo), 1500);
  }

  stopSendingOffers() {
    if (this.offerId) {
      clearInterval(this.offerId);
    }
  }

  sendDisconnectMessage() {
    this.stopSendingOffers();
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
    this.sendStopSendingOffers();
  }

  handleCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).then().catch();
  }

  handleAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer)).then();
    console.log('connections established successfully');
    this.sendStopSendingOffers();
  }

  send(message) {
    if (this.connection === null || this.connection.readyState === WebSocket.CLOSED || this.connection.readyState === WebSocket.CLOSING) {
      this.initializeConnection();
    }
    timer(500).subscribe(() => {
      console.log(message);
      this.connection.send(JSON.stringify(message));
    });
  }

  async getStreams(remoteVideo: ElementRef) {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
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
    };

    this.connection.onmessage = (msg) => {
      const content = JSON.parse(msg.data);
      if (content !== 'ping') {

        const data = content.data.data;
        if (content.data.meeting_id === this.meetingId) {
          console.log('Got message', content.event);
          switch (content.event) {
            case 'offer':
              this.handleOffer(data, this.videoElement);
              break;
            case 'answer':
              this.handleAnswer(data);
              break;
            case 'candidate':
              this.handleCandidate(data);
              break;
            case 'disconnect':
              this.videoElement.nativeElement.srcObject = null;
              break;
            case 'stop-offers':
              this.stopSendingOffers();
              break;
            default:
              break;
          }
        }
      }
    };
  }

  private sendStopSendingOffers() {
    for (let i = 0; i < 3; i++) {
      timer(i * 1000).subscribe(() => {
        this.send({
          event: 'stop-offers',
          data: {
            data: null,
            meeting_id: this.meetingId
          }
        });
      });
    }
  }

  private sendPingMessage() {
    this.send('ping');
  }

  stopMeeting() {
    this.stopSendingOffers();
    if (this.pingPongId) {
      clearInterval(this.pingPongId);
    }
    if (this.dataChannel != null) {
      this.dataChannel.close();
    }
    if (this.peerConnection != null) {
      this.peerConnection.close();
    }

    this.remoteStream.getTracks().forEach(track => this.remoteStream.removeTrack(track));

    timer(3000).subscribe(() => {
      this.initializeRtcPeerConnection();
    });
  }

}
