import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoService} from '@app/_services/video.service';
import {CourseInfo} from '@app/_models/course-info';
import {AccountService} from '@app/_services';
import {CourseService} from '@app/_services/course.service';
import {Section} from '@app/_models/section';
import {Meeting} from '@app/_models/meeting';
import {MeetingService} from '@app/_services/meeting.service';
import {User} from '@app/_models';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';
import {Attachment} from '@app/_models/attachment';
import {ChatService} from '@app/_services/chat.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less']
})
export class CourseComponent implements OnInit {
  @ViewChild('video', {static: true}) videoElementRef: ElementRef;

  videoElement: HTMLVideoElement;
  mediaRecorder: MediaRecorder;
  recordedBlobs: Blob[];
  isRecording = false;
  hasRecorded = false;
  stream: MediaStream;
  hideRecording = true;
  course: CourseInfo;
  sections: Section[] = [];
  meetings: Meeting[] = [];
  users: User[] = [];
  courseId: string;

  isPlaying = false;

  displayControls = true;
  popup: boolean;

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService,
              private router: Router, private accountService: AccountService, private courseService: CourseService,
              private meetingService: MeetingService, private chatService: ChatService) {
    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');

    this.courseService.getCourse(this.courseId).subscribe(course => {
      this.course = course;

      this.getSections();
      this.getMeetingsForUser();
      this.getParticipants();
    });
  }

  ngOnInit(): void {
    this.videoElement = this.videoElementRef.nativeElement;

    navigator.mediaDevices.getUserMedia({
      video: {
        width: 360
      },
      audio: true
    }).then(stream => {
      this.stream = stream;
      this.videoElement.srcObject = this.stream;
    });
  }

  startRecording() {
    this.recordedBlobs = [];
    const options: MediaRecorderOptions = {mimeType: 'video/webm'};

    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = !this.isRecording;
    this.hasRecorded = true;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.recordedBlobs);
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.');
      return;
    }
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
      console.log('cannot send empty recording'); // TODO alert or sth
      return;
    }
    const video = new Blob(this.recordedBlobs, {type: 'video/webm'});
    console.log('video: ' + video);
    const file = new File([video], recordDescriptor.name);

    this.courseService.addAttachment(this.createAttachmentFromDescriptor(recordDescriptor), recordDescriptor.section).subscribe(a => {
      this.videoService.saveAttachment(file, a.attachmentId).subscribe(() => {
        this.getSections();
      });
    });

    // this.videoService.saveUserVideo(video, this.course.courseId, recordDescriptor.section, recordDescriptor.name).subscribe(name => {
    //   console.log(name);
    // });
  }

  toggleRecording() {
    this.hideRecording = !this.hideRecording;
  }

  goToEditPage() {
    console.log(this.course);
    this.router.navigate(['/course/edit', this.course.courseId], {state: {courseInfo: this.course}});
  }

  canEdit(): boolean {
    return this.accountService.userValue.role === 'ADMIN';
  }

  getSections(): void {
    this.courseService.getSectionsForCourse(this.course.courseId).subscribe(sections => {
      console.log(sections);
      this.sections = sections;
    }, () => {
      this.sections = [];
    });
  }

  getMeetingsForUser(): void {
    this.meetingService.getMeetingsForUser(this.accountService.userValue, this.course).subscribe(meetings => {
      console.log(meetings);
      this.meetings = meetings;
    }, () => {
      this.meetings = [];
    });
  }

  addMeeting(meeting: Meeting) {
    meeting.course = this.course;
    this.meetingService.createMeeting(meeting).subscribe(m => {
      this.meetings.push(m);
    });
  }

  goToMeeting(meeting: Meeting) {
    console.log(meeting);
    this.router.navigate(['/meeting', meeting.meetingId], {state: {meeting}});
  }

  formatDate(date: string): string {
    return date.split('T')[0];
  }

  formatTime(date: string): string {
    const fullTimeSplit = date.split('T')[1].split(':');
    return fullTimeSplit[0] + ':' + fullTimeSplit[1];
  }

  getParticipants() {
    this.courseService.getUsersForCourse(this.course.courseId, false).subscribe(users => {
      this.users = users;
    }, () => {
      this.users = [];
    });
  }

  addUserToCourse(userId: string) {
    this.courseService.joinNewCourse(this.course.courseId, userId).subscribe(() => {
      this.getParticipants();
    });
  }

  isOwner(): boolean {
    return this.course.teacher.userId === this.accountService.userValue.userId;
  }

  deleteUserFromCourse(user: User) {
    this.courseService.deleteUserFromCourse(this.course.courseId, user.userId).subscribe(() => {
      this.getParticipants();
    });
  }

  createAttachmentFromDescriptor(descriptor): Attachment {
    const attachment = NewObjectsHelper.createEmptyAttachment();
    attachment.user = this.accountService.userValue;
    attachment.content = descriptor.name;
    attachment.type = 'mp4';
    attachment.course = this.course;

    return attachment;
  }

  formatMeetingUser(meeting: Meeting): string {
    return meeting.student.username === this.accountService.userValue.username ? meeting.teacher.username : meeting.student.username;
  }
}
