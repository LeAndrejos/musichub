import {CourseInfo} from '@app/_models/course-info';
import {User} from '@app/_models/user';

export interface Attachment {
  attachmentId: string;
  type: string;
  content: string;
  course: CourseInfo;
  user: User;
}
