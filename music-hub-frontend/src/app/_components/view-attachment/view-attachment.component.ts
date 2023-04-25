import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoService} from '@app/_services/video.service';
import {AttachmentTypeHelper} from '@app/_helpers/attachmentTypeHelper';
import {Attachment} from '@app/_models/attachment';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.less']
})
export class ViewAttachmentComponent implements OnInit {

  imageSrc: any;
  pdfSrc: any;
  attachmentId: string;
  attachment: Attachment;
  isLoading = false;
  percentLoaded = 0;
  @ViewChild('videoAttachment') videoAttachment;

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService, private sanitizer: DomSanitizer,
              private router: Router) {
    this.attachmentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.percentLoaded = 0;

    videoService.getAttachment(this.attachmentId).subscribe(attachment => {
      this.attachment = attachment;
      console.log(attachment.type);
      this.createAttachmentUrl(this.attachment);
    });
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate(['/course', this.attachment.sectionId.course.courseId]);
  }

  createAttachmentUrl(attachment: Attachment) {
    this.videoService.getFileSize(attachment.attachmentId).subscribe(size => {
      this.videoService.getFile(attachment).subscribe((e) => {
        if (e.type === HttpEventType.Response) {
          this.isLoading = false;
          const blob = new Blob([e.body], {type: AttachmentTypeHelper.getResponseType(attachment.type)});
          const url = URL.createObjectURL(blob);
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
          this.pdfSrc = url;
        } else if (e.type === HttpEventType.DownloadProgress) {
          this.percentLoaded = e.loaded / size * 100;
        }
      });
    });
  }
}
