import {Component, OnInit} from '@angular/core';
import {AccountService} from '@app/_services';
import {User} from '@app/_models';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.less']
})
export class UserManagerComponent implements OnInit {

  users: User[] = [];
  newTeacher: User;
  readonly displayedColumns: string[] = ['username', 'roleButton', 'deleteButton'];

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  deleteUser(username: string): void {
    this.accountService.deleteUser(username).subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.accountService.getUsers().subscribe(users => this.users = users.filter(user => user.role !== 'ADMIN'));
  }

  createNewTeacher(): void {
    this.accountService.createNewTeacher().subscribe(newTeacher => {
        this.loadUsers();
        this.newTeacher = newTeacher;
      }
    );
  }

}
