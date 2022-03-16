import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CallService} from '@app/_services/call.service';
import {Meeting} from '@app/_models/meeting';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingService} from '@app/_services/meeting.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.less']
})
export class MeetingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoConference') remoteVideo;
  meeting: Meeting;
  isCalling = false;
  hasCallEnded = false;

  constructor(private callService: CallService, private router: Router, private meetingService: MeetingService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.callService.startMeeting();
  }

  ngAfterViewInit() {
    const meetingId = this.activatedRoute.snapshot.paramMap.get('id');
    this.meetingService.getMeeting(meetingId).subscribe(meeting => {
      this.meeting = meeting;
      this.callService.setVideoElement(this.remoteVideo);
      this.callService.setMeetingId(this.meeting.meetingId);
    });
  }

  call() {
    this.callService.createOffer(this.remoteVideo);
    this.isCalling = true;
  }

  endCall() {
    this.remoteVideo.nativeElement.srcObject = null;
    this.callService.sendDisconnectMessage();
    this.hasCallEnded = true;
  }

  ngOnDestroy(): void {
    this.callService.stopMeeting();
  }

}
