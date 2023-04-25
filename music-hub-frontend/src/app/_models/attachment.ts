import {CourseInfo} from '@app/_models/course-info';
import {User} from '@app/_models/user';
import {Section} from '@app/_models/section';

export interface Attachment {
  attachmentId: string;
  type: string;
  content: string;
  sectionId: Section;
  course: CourseInfo;
  user: User;
  isLoading: boolean;
  percentLoaded: number;
  isDownloading: boolean;
  percentDownloaded: number;
}
