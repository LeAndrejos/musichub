import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AccountService} from '@app/_services/account.service';
import {User} from '@app/_models';
import {environment} from '@environments/environment';
import {Section} from '@app/_models/section';
import {Attachment} from '@app/_models/attachment';
import {CourseInfo} from '@app/_models/course-info';
import {Observable} from 'rxjs';
import {CreateFormHelper} from '@app/_helpers/createFormHelper';

@Injectable({
  providedIn: 'root'
})
export class VideoContentServiceService {

  constructor(private http: HttpClient, private accountService: AccountService) { }

  private user: User;
  private apiUrl = environment.apiUrl;
  private getSubscriptionsUrl = '/video-content';
  private getAvatarUrl = '/file/';
  private createCourseUrl = '/video-content';
  private editCourseUrl = '/video-content';
  private getAttachmentsUrl = '/attachment/';
  private createAttachmentUrl = '/attachment/';
  private deleteAttachmentUrl = '/attachment/';


  sections: Section[] = [];
  attachments: Attachment[] = [];
  courses: CourseInfo[] = [];

  public getUserCourses(): Observable<CourseInfo[]> {
    this.user = this.accountService.userValue;
    const params = new HttpParams().set('username', this.user.username);
    return this.http.get<CourseInfo[]>(`${this.apiUrl}${this.getSubscriptionsUrl}`);
  }

  public getCourseAvatar(id: string): Observable<Blob> {
    console.log(id);
    const url = `${this.apiUrl}${this.getAvatarUrl}${id}`;
    return this.http.get(url, {responseType: 'blob'});
  }

  public joinNewCourse(courseId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/video-content/${courseId}/addStudent/${userId}`, {});
  }

  public getCourseByTitle(courseTitle: string): Observable<CourseInfo> {
    return this.http.get<CourseInfo>(`${this.apiUrl}/video-content/title?courseTitle=${courseTitle}`);
  }

  public getSectionsForCourse(courseId: string): Observable<Section[]> {

    return this.http.get<Section[]>(`${this.apiUrl}/video-content/${courseId}/section`);
  }

  public createSection(section: Section, courseId: string): Observable<any> {
    console.log(section);
    console.log(courseId);
    return this.http.post(`${this.apiUrl}/video-content/${courseId}/section`, CreateFormHelper.createSectionForm(section));
  }

  public deleteAttachment(attachment: Attachment): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.deleteAttachmentUrl}${attachment.attachmentId}`);
  }

  public addAttachment(attachment: Attachment, sectionId: string): Observable<Attachment> {
    return this.http.post<Attachment>(`${this.apiUrl}${this.createAttachmentUrl}${sectionId}`,
      CreateFormHelper.createAttachmentForm(attachment));
  }

  public createCourse(course: CourseInfo): Observable<any> {
    console.log(course);
    return this.http.post<CourseInfo>(`${this.apiUrl}${this.createCourseUrl}`, CreateFormHelper.createCourseForm(course));
  }

  public editCourse(course: CourseInfo): Observable<any> {
    console.log(typeof course);
    return this.http.put<CourseInfo>(`${this.apiUrl}${this.editCourseUrl}/${course.courseId}`, {
      title: course.title,
      avatar: course.avatar,
      description: course.description,
      isFullCourse: true
    });
  }

  public getAttachmentsForSection(sectionId: string): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}${this.getAttachmentsUrl}${sectionId}`);
  }

  public getUsersForCourse(courseId: string, withAdmin: boolean): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/video-content/${courseId}/showParticipants?admin=${withAdmin}`);
  }

  public deleteUserFromCourse(courseId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/video-content/${courseId}/deleteStudent/${userId}`);
  }

  public getCourse(courseId: string): Observable<CourseInfo> {
    return this.http.get<CourseInfo>(`${this.apiUrl}/video-content/${courseId}`);
  }

  public getSubsectionNumber(courseId: string, sectionId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/video-content/${courseId}/section/${sectionId}/subsection/length`);
  }

  public getSubsections(courseId: string, sectionId: string): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/video-content/${courseId}/section/${sectionId}/subsection`);
  }

  public deleteSection(courseId: string, sectionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/video-content/${courseId}/section/${sectionId}`);
  }

  public deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/video-content/${courseId}`);
  }

  public updateSection(section: Section, courseId: string): Observable<Section> {
    return this.http.put<Section>(`${this.apiUrl}/video-content/${courseId}/section/${section.sectionId}`,
      CreateFormHelper.createSectionForm(section));
  }
}
