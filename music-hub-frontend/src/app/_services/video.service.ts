import {Injectable} from '@angular/core';
import {User} from '@app/_models';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {AccountService} from '@app/_services/account.service';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {Attachment} from '@app/_models/attachment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = environment.apiUrl;
  private saveFileUrl = '/file/save';
  private getFileUrl = '/file/';
  private saveAttachmentUrl = '/file/';
  private user: User;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }

  public saveUserVideo(video: Blob, course: string, section: string, name: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', video);
    formData.append('username', this.user.username);
    formData.append('course', course);
    formData.append('section', section);
    return this.http.post<string>(`${this.apiUrl}${this.saveFileUrl}`, formData);
  }

  public getFile(attachment: Attachment): Observable<HttpEvent<any>> {
    return this.getFileWithId(attachment.attachmentId);
  }

  public getFileWithId(attachmentId: string): Observable<HttpEvent<any>> {
    return this.http.get(`${this.apiUrl}${this.getFileUrl}${attachmentId}`,
      {reportProgress: true, observe: 'events', responseType: 'blob'});
  }

  public getFileSize(attachmentId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}${this.getFileUrl}${attachmentId}/size`);
  }

  public saveAttachment(file: File, attachmentId: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file.name);
    return this.http.post(`${this.apiUrl}${this.saveAttachmentUrl}${attachmentId}`, formData, {reportProgress: true, observe: 'events'});
  }

  public getAttachment(attachmentId: string): Observable<Attachment> {
    return this.http.get<Attachment>(`${this.apiUrl}/attachment/attachment/${attachmentId}`);
  }
}
