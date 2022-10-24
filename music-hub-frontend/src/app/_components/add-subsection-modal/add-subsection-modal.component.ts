import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalDismissReasons, NgbHighlight, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CourseService} from '@app/_services/course.service';
import {Section} from '@app/_models/section';
import {CourseInfo} from '@app/_models/course-info';
import {CreateFormHelper} from '@app/_helpers/createFormHelper';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';

@Component({
  selector: 'app-add-subsection-modal',
  templateUrl: './add-subsection-modal.component.html',
  styleUrls: ['./add-subsection-modal.component.less']
})
export class AddSubsectionModalComponent implements OnInit {
  name: string;
  description = '';
  closeResult: string;
  numberInOrder: number;
  @Input() course: CourseInfo;
  @Input() parentSection: Section;
  @Output() subsectionCreate: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.courseService.getSubsectionNumber(this.course.courseId, this.parentSection.sectionId).subscribe(numberInOrder => {
      this.numberInOrder = numberInOrder;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close() {
    const section = this.createSection();
    this.subsectionCreate.emit(section);
    this.modalService.dismissAll();
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

  private createSection(): Section {
    const section = NewObjectsHelper.createEmptySection();
    section.section_name = this.name;
    section.description = this.description;
    section.num_order = this.numberInOrder;
    section.course = this.course;
    section.parentSection = this.parentSection;
    console.log(section);
    return section;
  }

}
