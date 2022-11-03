import {Component, OnInit} from '@angular/core';
import {User} from '@app/_models';
import {AccountService} from '@app/_services';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  user: User = null;
  closeResult: string;

  constructor(private accountService: AccountService, private router: Router, private modalService: NgbModal) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
  }

  logout() {
    this.accountService.logout();
  }

  login(){
    this.router.navigate(['/account/login']);
  }

  hasRoute(route: string): boolean {
    return this.router.url === route;
  }

  canJoinCourses(): boolean {
    return this.hasRoute('/courses');
  }

  canCreateCourse(): boolean {
    return this.user.role && this.hasRoute('/courses');
  }

  goToAccount() {
    this.router.navigate(['/account/edit']);
  }

  goToUserManaging() {
    this.router.navigate(['/manage-users']);
  }

  isVisible(): boolean {
    return this.user != null || this.router.url === '/';
  }

}
