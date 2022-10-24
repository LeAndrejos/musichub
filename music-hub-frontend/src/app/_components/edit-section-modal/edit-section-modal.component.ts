import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from '@app/_models/section';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-section-modal',
  templateUrl: './edit-section-modal.component.html',
  styleUrls: ['./edit-section-modal.component.less']
})
export class EditSectionModalComponent implements OnInit {

  name: string;
  description = '';
  closeResult: string;
  @Input() section: Section;
  @Output() sectionEdit: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.name = this.section.section_name;
    this.description = this.section.description;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close() {
    this.section.description = this.description;
    this.section.section_name = this.name;
    this.sectionEdit.emit(this.section);
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

}
