import {CourseInfo} from './course-info';
import {Attachment} from '@app/_models/attachment';

export interface Section {
  sectionId: string;
  section_name: string;
  num_order: number;
  course: CourseInfo;
  description: string;
  attachments: Attachment[];
  parentSection: Section;
}
