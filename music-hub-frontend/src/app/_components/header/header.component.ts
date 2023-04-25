import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('sidenav') sideNav;

  constructor(private accountService: AccountService, private router: Router, private modalService: NgbModal) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  // @HostListener('document:click', ['$event'])
  // documentClick(event: any): void {
  //   setTimeout(() => {
  //       if (event.currentTarget.activeElement !== this.sideNav?.nativeElement && this.sideNav.opened) {
  //         this.sideNav.close();
  //       }
  //     },
  //     100);
  // }

  ngOnInit(): void {
  }

  logout() {
    this.sideNav.close();
    this.accountService.logout();
  }

  login() {
    this.sideNav.close();
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
    this.sideNav.close();
    this.router.navigate(['/account/edit']);
  }

  goToUserManaging() {
    this.sideNav.close();
    this.router.navigate(['/manage-users']);
  }

  isVisible(): boolean {
    return this.user != null || this.router.url === '/';
  }

}
