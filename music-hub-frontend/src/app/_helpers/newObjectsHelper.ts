import {CourseInfo} from '../_models/course-info';
import {Section} from '../_models/section';
import {Attachment} from '../_models/attachment';
import {Meeting} from '@app/_models/meeting';

export class NewObjectsHelper {
  public static createEmptyCourse(): CourseInfo {
    return {
      courseId: '',
      title: '',
      description: '',
      avatar: '',
      teacher: null
    };
  }

  public static createEmptySection(): Section {
    return {
      sectionId: '',
      section_name: 'string',
      num_order: 0,
      course: null,
      description: '',
      attachments: [],
      parentSection: null
    };
  }

  public static createEmptyAttachment(): Attachment {
    return {
      attachmentId: '',
      type: '',
      content: '',
      course: null,
      user: null
    };
  }

  public static createEmptyMeeting(): Meeting {
    return {
      meetingId: '',
      title: '',
      startTime: null,
      teacher: null,
      student: null,
      courseId: null
    };
  }
}
