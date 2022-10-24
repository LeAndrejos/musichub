import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from '@app/_models/section';
import {CourseService} from '@app/_services/course.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MeetingService} from '@app/_services/meeting.service';
import {Meeting} from '@app/_models/meeting';

@Component({
  selector: 'app-send-meeting-recording-modal',
  templateUrl: './send-meeting-recording-modal.component.html',
  styleUrls: ['./send-meeting-recording-modal.component.less']
})
export class SendMeetingRecordingModalComponent implements OnInit {

  @Input() meetingId: string;
  title: string;
  section: Section;
  sections: Section[];
  closeResult: string;
  isSubmitted: boolean;
  isSelected: boolean;
  meeting: Meeting;
  @Output() sendRecording: EventEmitter<any> = new EventEmitter();

  constructor(private courseService: CourseService, private modalService: NgbModal, private meetingService: MeetingService) {
  }

  ngOnInit(): void {
    this.getSections();
  }

  getSections() {
    this.meetingService.getMeeting(this.meetingId).subscribe(meeting => {
      this.meeting = meeting;
      this.courseService.getSectionsForCourse(this.meeting.courseId.courseId).subscribe(sections => {
        this.sections = sections;
      }, () => {
        this.sections = [];
      });
    });
  }

  open(content) {
    this.section = null;
    this.isSubmitted = false;
    this.isSelected = false;
    this.getSections();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSelectionChange(selected) {
    this.isSelected = true;
    this.section = selected.value;
  }

  getRecordingDescriptorObject(): object {
    return {
      section: this.section.sectionId,
      name: this.title
    };
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
    if (!this.isSelected) {
      this.isSubmitted = true;
      return;
    }
    this.sendRecording.emit(this.getRecordingDescriptorObject());
    console.log(this.section.sectionId);
    this.modalService.dismissAll();
  }

  // getSections() {
  //   this.courseService.getSectionsForCourse(this.courseId).subscribe(sections => {
  //     this.sections = sections;
  //   }, () => {
  //     this.sections = [];
  //   });
  // }

}
