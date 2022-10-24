import {User} from './user';
import {CourseInfo} from './course-info';

export interface Meeting {
  meetingId: string;
  title: string;
  startTime: Date;
  teacher: User;
  student: User;
  courseId: CourseInfo;
}
