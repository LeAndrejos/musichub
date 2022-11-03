import { Component, OnInit } from '@angular/core';
import {CourseInfo} from '@app/_models/course-info';
import {Section} from '@app/_models/section';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '@app/_services/course.service';
import {NewObjectsHelper} from '@app/_helpers/newObjectsHelper';
import {VideoContentServiceService} from '@app/_services/video-content-service.service';

@Component({
  selector: 'app-video-content-create-edit',
  templateUrl: './video-content-create-edit.component.html',
  styleUrls: ['./video-content-create-edit.component.less']
})
export class VideoContentCreateEditComponent implements OnInit {

  course: CourseInfo;
  fileName = '';
  sections: Section[] = [];
  avatar: File;
  title: string;
  description = '';
  mode = 'EDIT';
  pageTitle = 'Edit video content page';

  constructor(private router: Router, private courseService: VideoContentServiceService, private activatedRoute: ActivatedRoute) {
    const courseId = this.activatedRoute.snapshot.paramMap.get('id');

    if (courseId === null) {
      this.course = NewObjectsHelper.createEmptyCourse();
      this.mode = 'CREATE';
      this.pageTitle = 'Create video content page';
    } else {
      this.courseService.getCourse(courseId).subscribe(course => {
        this.course = course;
        this.title = this.course.title;
        this.description = this.course.description;
      });
    }
  }

  ngOnInit(): void {
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
    }
  }

  save() {
    this.course.title = this.title;
    this.course.description = this.description;
    console.log(this.course);
    if (this.mode === 'CREATE') {
      this.courseService.createCourse(this.course).subscribe(() => {
        this.router.navigate(['/video-content']);
      });
    } else {
      this.courseService.editCourse(this.course).subscribe(() => {
        this.router.navigate(['/video-content']);
      });
    }
  }

}
