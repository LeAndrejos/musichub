import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Section} from '@app/_models/section';
import {MatAccordion} from '@angular/material/expansion';
import {VideoService} from '@app/_services/video.service';
import {Attachment} from '@app/_models/attachment';
import {AttachmentTypeHelper} from '@app/_helpers/attachmentTypeHelper';
import {CourseService} from '@app/_services/course.service';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';
import {AccountService} from '@app/_services';
import {CourseInfo} from '@app/_models/course-info';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpEventType} from '@angular/common/http';

declare var Android: AndroidInterface;

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.less']
})
export class SectionComponent implements OnInit {

  @Input() section: Section;
  @Input() course: CourseInfo;
  @Input() isSubsection = false;
  @Input() isSecondaryTeacher = false;
  @Output() sectionDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() sectionUpdate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatAccordion)
  accordion: MatAccordion;

  attachments: Attachment[] = [];
  userAttachments: Attachment[] = [];
  subsections: Section[] = [];

  constructor(private videoService: VideoService, private courseService: CourseService, private accountService: AccountService,
              private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getAttachments();
  }

  getAttachment(attachment: Attachment) {
    attachment.percentDownloaded = 0;
    attachment.isDownloading = true;
    this.videoService.getFileSize(attachment.attachmentId).subscribe(size => {
      this.videoService.getFile(attachment).subscribe((e) => {
        if (e.type === HttpEventType.Response) {
          attachment.isDownloading = false;
          const blob = new Blob([e.body], {type: AttachmentTypeHelper.getResponseType(attachment.type)});
          const downloadUrl = window.URL.createObjectURL(blob);
          const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
          if (isAndroid) {
            eval(Android.getBase64StringFromBlobUrl(downloadUrl, AttachmentTypeHelper.getResponseType(attachment.type), attachment.content));
          } else {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = attachment.content;
            link.click();
          }
        } else if (e.type === HttpEventType.DownloadProgress) {
          attachment.percentDownloaded = e.loaded / size * 100;
        }
      });
    });
  }

  deleteAttachment(attachment: Attachment): void {
    this.courseService.deleteAttachment(attachment).subscribe(() => {
      this.getAttachments();
    });
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    const attachment = NewObjectsHelper.createEmptyAttachment();
    console.log(attachment);
    console.log(file.size);
    if (file.size > 500000000) {
      this.snackBar.open('Attachment is too big', 'Close');
      return;
    }
    attachment.content = file.name;
    attachment.course = this.section.course;
    attachment.type = file.name.split('.').pop();
    attachment.user = this.accountService.userValue;
    console.log(attachment);
    this.courseService.addAttachment(attachment, this.section.sectionId).subscribe((a) => {
      a.isLoading = true;
      if (this.accountService.userValue.userId === this.section.course.teacher.userId) {
        this.attachments.push(a);
      } else {
        this.userAttachments.push(a);
      }
      this.videoService.saveAttachment(file, a.attachmentId).subscribe(e => {
        if (e.type === HttpEventType.UploadProgress) {
          a.percentLoaded = e.loaded / file.size * 100;
        }
        if (e.type === HttpEventType.Response) {
          a.isLoading = false;
        }
      });
    });
  }

  isOwner(): boolean {
    return this.course.teacher.userId === this.accountService.userValue.userId || this.accountService.userValue.role === 'ADMIN' || this.isSecondaryTeacher;
  }

  isOwnerOfAttachment(attachment: Attachment): boolean {
    return this.accountService.userValue.userId === attachment.user.userId;
  }

  getAttachments() {
    this.courseService.getAttachmentsForSection(this.section.sectionId).subscribe(attachments => {
      this.attachments = attachments.filter(a => a.user.userId === this.course.teacher.userId);
      this.userAttachments = this.filterUserAttachments(attachments);
    });
  }

  filterUserAttachments(attachments: Attachment[]): Attachment[] {
    if (this.accountService.userValue.userId === this.course.teacher.userId) {
      return attachments.filter(a => a.user.userId !== this.accountService.userValue.userId);
    } else {
      return attachments.filter(a => a.user.userId === this.accountService.userValue.userId);
    }
  }

  delete() {
    this.courseService.deleteSection(this.course.courseId, this.section.sectionId).subscribe(() => {
      this.sectionDelete.emit(this.section.sectionId);
    });
  }

  updateSection(section) {
    this.courseService.updateSection(section, this.course.courseId).subscribe(s => {
      this.sectionUpdate.emit(s);
    });
  }

  viewAttachment(attachment: Attachment) {
    this.router.navigate(['/view-attachment', attachment.attachmentId]);
  }

  isViewable(attachment: Attachment) {
    return AttachmentTypeHelper.getResponseType(attachment.type) !== 'unsupported';
  }
}

interface AndroidInterface {
  getBase64StringFromBlobUrl(downloadUrl: string, mimeType: string, name: string): string;
}
