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

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.less']
})
export class SectionComponent implements OnInit {

  @Input() section: Section;
  @Input() course: CourseInfo;
  @Output() sectionDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() sectionUpdate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatAccordion)
  accordion: MatAccordion;

  attachments: Attachment[] = [];
  userAttachments: Attachment[] = [];
  subsections: Section[] = [];

  constructor(private videoService: VideoService, private courseService: CourseService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getAttachments();
  }

  getAttachment(attachment: Attachment) {
    this.videoService.getFile(attachment).subscribe((data) => {
      console.log(attachment);
      const blob = new Blob([data], {type: AttachmentTypeHelper.getResponseType(attachment.type)});
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = attachment.content;
      link.click();
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
    attachment.content = file.name;
    attachment.course = this.section.course;
    attachment.type = file.name.split('.').pop();
    attachment.user = this.accountService.userValue;
    this.courseService.addAttachment(attachment, this.section.sectionId).subscribe((a) => {
      if (this.accountService.userValue.userId === this.section.course.teacher.userId) {
        this.attachments.push(a);
      } else {
        this.userAttachments.push(a);
      }
      this.videoService.saveAttachment(file, a.attachmentId).subscribe();
    });
  }

  isOwner(): boolean {
    return this.course.teacher.userId === this.accountService.userValue.userId;
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

}
