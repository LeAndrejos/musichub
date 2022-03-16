import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from '@app/_models/section';
import {CourseService} from '@app/_services/course.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-send-recording-modal',
  templateUrl: './send-recording-modal.component.html',
  styleUrls: ['./send-recording-modal.component.less']
})
export class SendRecordingModalComponent implements OnInit {

  @Input() courseId: string;
  title: string;
  section: Section;
  sections: Section[];
  closeResult: string;
  isSubmitted: boolean;
  isSelected: boolean;
  @Output() sendRecording: EventEmitter<any> = new EventEmitter();

  constructor(private courseService: CourseService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getSections();
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

  getSections() {
    this.courseService.getSectionsForCourse(this.courseId).subscribe(sections => {
      this.sections = sections;
    }, () => {
      this.sections = [];
    });
  }

  getRecordingDescriptorObject(): object {
    return {
      section: this.section.sectionId,
      name: this.title
    };
  }

  onSelectionChange(selected) {
    this.isSelected = true;
    this.section = selected.value;
  }
}
