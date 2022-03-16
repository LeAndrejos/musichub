import {Component, OnInit} from '@angular/core';
import {User} from '@app/_models';
import {AccountService, AlertService} from '@app/_services';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {

  user: User;
  username: string;
  password: string;
  avatar: File;
  avatarUrl: any;

  constructor(private accountService: AccountService, private alertService: AlertService) {
    this.user = accountService.userValue;
    this.username = this.user.username;
    this.getAvatar();
  }

  ngOnInit(): void {
  }

  getAvatar() {
    this.avatarUrl = this.accountService.getAvatarForUser(this.user);
  }

  updateAccount() {
    this.alertService.clear();
    this.accountService.updateUser(this.username, this.password).subscribe(() => {
      this.accountService.logout();
    }, () => {
      this.alertService.error('Username is already taken');
    });
  }

  onFileSelected(event) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    this.avatar = files[0];
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (progressEvent) => {
      this.avatarUrl = reader.result;
    };
  }
}
