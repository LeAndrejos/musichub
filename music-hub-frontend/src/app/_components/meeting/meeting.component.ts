import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CallService} from '@app/_services/call.service';
import {Meeting} from '@app/_models/meeting';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingService} from '@app/_services/meeting.service';
import {CourseService} from '@app/_services/course.service';
import {Attachment} from '@app/_models/attachment';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';
import {AccountService} from '@app/_services';
import {VideoService} from '@app/_services/video.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.less']
})
export class MeetingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoConference') remoteVideo;
  meeting: Meeting;
  meetingId: string;
  isCalling = false;
  hasCallEnded = false;
  recordedBlobs: Blob[];
  mediaRecorder: MediaRecorder;
  isRecording = false;
  hasRecorded = false;

  constructor(private callService: CallService, private router: Router, private meetingService: MeetingService,
              private activatedRoute: ActivatedRoute, private courseService: CourseService,
              private accountService: AccountService, private videoService: VideoService) {
  }

  ngOnInit(): void {
    const meetingId = this.activatedRoute.snapshot.paramMap.get('id');
    this.meetingId = meetingId;
    this.meetingService.getMeeting(meetingId).subscribe(meeting => {
      this.meeting = meeting;
      this.callService.setVideoElement(this.remoteVideo);
      this.callService.setMeetingId(this.meeting.meetingId);
    });
  }

  ngAfterViewInit() {

  }

  call() {
    this.callService.initialize();
    this.isCalling = true;
  }

  endCall() {
    this.remoteVideo.nativeElement.srcObject = null;
    this.callService.sendDisconnectMessage();
    this.callService.stopMeeting();
    this.hasCallEnded = true;
  }

  goBack() {
    this.endCall();
    this.router.navigate(['/course', this.meeting.courseId.courseId]);
  }

  ngOnDestroy(): void {
    this.endCall();
  }

  startRecording() {
    this.recordedBlobs = [];
    const options: MediaRecorderOptions = {mimeType: 'video/webm'};

    try {
      this.mediaRecorder = new MediaRecorder(this.callService.remoteStream, options);
      this.mediaRecorder.start();
      this.isRecording = !this.isRecording;
      this.hasRecorded = true;
      this.onDataAvailableEvent();
      this.onStopRecordingEvent();
    } catch (err) {
      console.log(err);
    }
  }

  isReadyToRecord(): boolean {
    return this.callService.remoteStream.getTracks().length !== 0;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.recordedBlobs);
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
      };
    } catch (error) {
      console.log(error);
    }
  }

  sendRecord(recordDescriptor) {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot send empty recording');
      return;
    }
    const video = new Blob(this.recordedBlobs, {type: 'video/webm'});
    console.log('video: ' + video);
    const file = new File([video], recordDescriptor.name);

    this.courseService.addAttachment(this.createAttachmentFromDescriptor(recordDescriptor), recordDescriptor.section).subscribe(a => {
      this.videoService.saveAttachment(file, a.attachmentId).subscribe(() => {
      });
    });

    // this.videoService.saveUserVideo(video, this.course.courseId, recordDescriptor.section, recordDescriptor.name).subscribe(name => {
    //   console.log(name);
    // });
  }

  createAttachmentFromDescriptor(descriptor): Attachment {
    const attachment = NewObjectsHelper.createEmptyAttachment();
    attachment.user = this.accountService.userValue;
    attachment.content = descriptor.name;
    attachment.type = 'mp4';
    attachment.course = this.meeting.courseId;

    return attachment;
  }


}
