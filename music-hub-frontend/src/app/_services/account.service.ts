import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {User} from '@app/_models';
import {CreateFormHelper} from '@app/_helpers/createFormHelper';
import {AuthenticatedUser} from '@app/_models/authenticatedUser';

@Injectable({providedIn: 'root'})
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public token: string;

  constructor(private router: Router, private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.getAuthenticatedUser(username, password).pipe((map((user) => {
      localStorage.setItem('user', JSON.stringify(user.user));
      this.userSubject.next(user.user);
      this.token = user.token;
      localStorage.setItem('token', user.token);
    })));
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/user`, CreateFormHelper.createUserForm(user));
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/${username}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/id/${id}`);
  }

  getAuthenticatedUser(username, password): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(`${environment.apiUrl}/user/auth`, {username, password});
  }

  getAvatarForUser(user: User): string {
    return 'assets/default-avatar.png';
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/user`);
  }

  updateUser(username: string, password: string): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/user`, {username, password});
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/user/${username}`);
  }

  createNewTeacher(): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user/createTeacher`, {});
  }
}
