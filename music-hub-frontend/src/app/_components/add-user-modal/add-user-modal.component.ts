import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '@app/_models';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AccountService} from '@app/_services';
import {CourseService} from '@app/_services/course.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.less']
})
export class AddUserModalComponent implements OnInit {

  users: User[] = [];
  user: User;
  closeResult: string;
  isSubmitted = false;
  isSelected = false;
  @Input() isForTeachers = false;
  @Input() courseId: string;
  @Output() addUser: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private accountService: AccountService, private courseService: CourseService) {
  }

  ngOnInit(): void {
  }

  open(content) {
    this.isSubmitted = false;
    this.isSelected = false;
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
    if (!this.isSelected) {
      return;
    }
    this.addUser.emit(this.user.userId);
    this.modalService.dismissAll();
  }

  getUsers() {
    this.accountService.getUsers().subscribe(allUsers => {
      if(this.isForTeachers) {
        this.courseService.getTeachersForCourse(this.courseId, false).subscribe(courseUsers => {
          const secondaryRole = this.isForTeachers ? 'STUDENT' : 'TEACHER';
          this.users = allUsers.filter(user => (!this.contains(courseUsers, user) && !(user.role === 'ADMIN')
            && !(user.role === secondaryRole)));
        });
      } else {
        this.courseService.getUsersForCourse(this.courseId, false).subscribe(courseUsers => {
          const secondaryRole = this.isForTeachers ? 'STUDENT' : 'TEACHER';
          this.users = allUsers.filter(user => (!this.contains(courseUsers, user) && !(user.role === 'ADMIN')
            && !(user.role === secondaryRole)));
        });
      }
    });
  }

  private contains(users: User[], user: User): boolean {
    console.log(user);
    for (const u of users) {
      if (u.userId === user.userId) {
        return true;
      }
    }
    return false;
  }

  onSelectionChange(selected) {
    this.isSelected = true;
    this.user = selected.value;
  }

}
