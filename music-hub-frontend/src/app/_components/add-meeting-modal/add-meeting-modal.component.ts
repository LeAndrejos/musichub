import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '@app/_models';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CourseService} from '@app/_services/course.service';
import {AccountService} from '@app/_services';
import {Meeting} from '@app/_models/meeting';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';
import {Time} from '@angular/common';
import {type} from 'os';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';

@Component({
  selector: 'app-add-meeting-modal',
  templateUrl: './add-meeting-modal.component.html',
  styleUrls: ['./add-meeting-modal.component.less']
})
export class AddMeetingModalComponent implements OnInit {

  title: string;
  startTime: string;
  student: User;
  users: User[];
  isUserSelected = false;
  isTimeSelected;
  isSubmitted = false;
  time: string;
  @Input() courseId: string;
  @Output() meetingCreate: EventEmitter<any> = new EventEmitter();

  timepickerTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#212529'
    },
    dial: {
      dialBackgroundColor: '#555'
    },
    clockFace: {
      clockFaceBackgroundColor: '#696969',
      clockHandColor: '#212529',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  closeResult: string;

  constructor(private modalService: NgbModal, private courseService: CourseService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  open(content) {
    this.clearInputs();
    this.getUsers();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  close() {
    this.isSubmitted = true;
    if (!this.canSubmit()) {
      return;
    }
    const meeting = this.createMeeting();
    console.log(meeting);
    this.meetingCreate.emit(meeting);
    this.modalService.dismissAll();
  }

  getUsers() {
    this.courseService.getUsersForCourse(this.courseId, false).subscribe(users => {
      console.log(users);
      this.users = users.filter(user => user.userId !== this.accountService.userValue.userId);
    }, () => {
      this.users = [];
    });
  }

  private createMeeting(): Meeting {
    const meeting = NewObjectsHelper.createEmptyMeeting();
    meeting.title = this.title;
    meeting.startTime = new Date(this.startTime);
    meeting.startTime.setHours(Number(this.time.split(':')[0]), Number(this.time.split(':')[1]));
    console.log(meeting.startTime);
    meeting.teacher = this.accountService.userValue;
    meeting.student = this.student;
    return meeting;
  }

  setTime(time: string) {
    this.isTimeSelected = true;
    this.time = time;
  }

  onSelectionChange(selected) {
    this.isUserSelected = true;
    this.student = selected.value;
  }

  clearInputs() {
    this.isSubmitted = false;
    this.isTimeSelected = false;
    this.isUserSelected = false;
    this.student = null;
    this.time = '';
    this.startTime = '';
    this.title = '';
  }

  isInvalid(input): boolean {
    return (input.invalid && (input.dirty || input.touched)) || (input.invalid && this.isSubmitted);
  }

  canSubmit(): boolean {
    return this.isUserSelected && this.isTimeSelected && this.title.length !== 0 && this.startTime.length !== 0;
  }

}
