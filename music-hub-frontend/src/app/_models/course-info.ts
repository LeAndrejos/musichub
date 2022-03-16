import {User} from '@app/_models/user';

export interface CourseInfo {
  // tslint:disable-next-line:variable-name
  courseId: string;
  title: string;
  description: string;
  avatar: string;
  teacher: User;
}
