import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Meeting} from '@app/_models/meeting';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {CreateFormHelper} from '@app/_helpers/createFormHelper';
import {User} from '@app/_models';
import {CourseInfo} from '@app/_models/course-info';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  private apiUrl = environment.apiUrl;
  private getMeetingsUrl = '/meeting';
  private getMeetingUrl = '/meeting';
  private deleteMeetingUrl = '/meeting';
  private createMeetingUrl = '/meeting/create';

  constructor(private http: HttpClient) {
  }

  public createMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.apiUrl}${this.createMeetingUrl}`, CreateFormHelper.createMeetingForm(meeting));
  }

  public getMeetingsForUser(user: User, course: CourseInfo): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}${this.getMeetingsUrl}?courseId=${course.courseId}`);
  }

  public getMeeting(meetingId: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}${this.getMeetingUrl}/${meetingId}`);
  }

  public deleteMeeting(meetingId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.deleteMeetingUrl}/${meetingId}`);
  }
}
