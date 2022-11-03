import { Component, OnInit } from '@angular/core';
import {CourseInfo} from '@app/_models/course-info';
import {CourseService} from '@app/_services/course.service';
import {Router} from '@angular/router';
import {AccountService} from '@app/_services';
import {VideoContentServiceService} from '@app/_services/video-content-service.service';

@Component({
  selector: 'app-video-content-list',
  templateUrl: './video-content-list.component.html',
  styleUrls: ['./video-content-list.component.less']
})
export class VideoContentListComponent implements OnInit {

  CoursesInfo: CourseInfo[];
  popup: boolean;
  value = '';

  constructor(private coursesService: VideoContentServiceService, private router: Router, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getCoursesInfo();
  }

  goToCourse(course: CourseInfo): void {
    console.log(course);
    this.router.navigate(['/video-content', course.courseId], {state: {courseInfo: course}});
  }

  canCreateCourse(): boolean {
    return this.accountService?.userValue?.role === 'TEACHER' || this.accountService?.userValue?.role === 'ADMIN';
  }

  goToCourseCreate(): void {
    this.router.navigate(['/video-content/create']);
  }

  getCoursesInfo() {
    this.coursesService.getUserCourses().subscribe(courses => {
      console.log(courses);
      this.CoursesInfo = courses;
      // console.log(courses);
      this.CoursesInfo.forEach(course => {
        // console.log(course);
        // this.coursesService.getCourseAvatar(course.avatarId).subscribe(avatar => {
        //   const reader = new FileReader();
        //   reader.addEventListener('load', () => {
        //     // course.avatarPath = reader.result;
        //   }, false);
        //   reader.readAsDataURL(avatar);
        //   console.log(reader.result);
        // });
        course.avatar = `./assets/courses-avatars/test_avatar_1.jpg`;
      });
      // console.log(this.CoursesInfo);
    });
  }

}
