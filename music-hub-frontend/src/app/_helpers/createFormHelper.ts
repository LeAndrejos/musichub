import {CourseInfo} from '../_models/course-info';
import {Attachment} from '@app/_models/attachment';
import {Section} from '@app/_models/section';
import {User} from '@app/_models';
import {Meeting} from '@app/_models/meeting';

export class CreateFormHelper {
  public static createCourseForm(course: CourseInfo): object {
    return {
      title: course.title,
      avatar: course.avatar,
      description: course.description,
      isFullCourse: true
    };
  }

  public static createAttachmentForm(attachment: Attachment): object {
    return {
      type: attachment.type,
      content: attachment.content,
      user: attachment.user.userId
    };
  }

  public static createSectionForm(section: Section): object {
    const parentSection = section.parentSection != null ? section.parentSection.sectionId : '';

    return {
      sectionName: section.section_name,
      description: section.description,
      parentSectionId: parentSection
    };
  }

  public static createUserForm(user: User): object {
    return {
      username: user.username,
      password: user.password
    };
  }

  public static createMeetingForm(meeting: Meeting): object {
    return {
      title: meeting.title,
      startTime: meeting.startTime,
      teacher: meeting.teacher.userId,
      student: meeting.student.userId,
      course: meeting.courseId.courseId
    };
  }
}
