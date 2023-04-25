import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CourseInfo} from '@app/_models/course-info';
import {Section} from '@app/_models/section';
import {Meeting} from '@app/_models/meeting';
import {User} from '@app/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoService} from '@app/_services/video.service';
import {AccountService} from '@app/_services';
import {MeetingService} from '@app/_services/meeting.service';
import {ChatService} from '@app/_services/chat.service';
import {Attachment} from '@app/_models/attachment';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';
import {VideoContentServiceService} from '@app/_services/video-content-service.service';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-video-content',
  templateUrl: './video-content.component.html',
  styleUrls: ['./video-content.component.less']
})
export class VideoContentComponent implements OnInit {

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
  teachers: User[] = [];
  courseId: string;
  isMobile = false;

  isPlaying = false;

  displayControls = true;
  popup: boolean;

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService,
              private router: Router, private accountService: AccountService, private courseService: VideoContentServiceService,
              private meetingService: MeetingService, private chatService: ChatService) {
    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');

    this.courseService.getCourse(this.courseId).subscribe(course => {
      this.course = course;

      this.getSections();
      this.getMeetingsForUser();
      this.getParticipants();
      this.getTeachers();
    });
  }

  ngOnInit(): void {
    this.videoElement = this.videoElementRef.nativeElement;

    (a => {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        this.isMobile = true;
      }
    })(navigator.userAgent || navigator.vendor);

    const constraints = this.isMobile ? {video: {width: 360, facingMode: 'environment'}, audio: true} : {video: {width: 360}, audio: true};

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
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
      a.isLoading = true;
      this.videoService.saveAttachment(file, a.attachmentId).subscribe(e => {
        this.getSections();
        if (e.type === HttpEventType.UploadProgress) {
          a.percentLoaded = e.loaded / file.size * 100;
        } else if (e.type === HttpEventType.Response) {
          a.isLoading = false;
        }
      });
    });
  }

  toggleRecording() {
    this.hideRecording = !this.hideRecording;
  }

  goToEditPage() {
    console.log(this.course);
    this.router.navigate(['/course/edit', this.course.courseId], {state: {courseInfo: this.course}});
  }

  canEdit(): boolean {
    return this.accountService.userValue.role === 'ADMIN' || this.accountService.userValue.role === 'TEACHER';
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
    meeting.courseId = this.course;
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

  getTeachers() {
    this.courseService.getTeachersForCourse(this.course.courseId, false).subscribe(users => {
      this.teachers = users;
    }, () => {
      this.teachers = [];
    });
  }

  addUserToCourse(userId: string) {
    this.courseService.joinNewCourse(this.course.courseId, userId).subscribe(() => {
      this.getParticipants();
    });
  }

  isOwner(): boolean {
    let isSecondaryTeacher = false;
    this.teachers.forEach(teacher => {
      if (teacher.userId === this.accountService.userValue.userId) {
        isSecondaryTeacher = true;
      }
    });
    return this.course?.teacher?.userId === this.accountService.userValue.userId || this.accountService.userValue.role === 'ADMIN' || isSecondaryTeacher;
  }

  deleteUserFromCourse(user: User) {
    this.courseService.deleteUserFromCourse(this.course.courseId, user.userId).subscribe(() => {
      this.getParticipants();
    });
  }

  deleteMeetingFromCourse(meeting: Meeting) {
    this.meetingService.deleteMeeting(meeting.meetingId).subscribe(() => {
      this.getMeetingsForUser();
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

  deleteCourse() {
    this.courseService.deleteCourse(this.courseId).subscribe(() => {
      this.router.navigate(['/courses']);
    });
  }

  isSecondaryTeacher() {
    let isSecondaryTeacher = false;
    this.teachers.forEach(t => {
      if (t.userId === this.accountService.userValue.userId) {
        isSecondaryTeacher = true;
      }
    });

    return isSecondaryTeacher;
  }

  addTeacherToCourse(teacherId: string) {
    this.courseService.addTeacherToCourse(this.course.courseId, teacherId).subscribe(() => {
      this.getTeachers();
    });
  }

}
