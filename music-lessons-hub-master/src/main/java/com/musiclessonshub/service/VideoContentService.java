package com.musiclessonshub.service;

import com.musiclessonshub.bean.CourseBean;
import com.musiclessonshub.bean.SectionBean;
import com.musiclessonshub.model.*;
import com.musiclessonshub.repository.CourseRepository;
import com.musiclessonshub.repository.CourseToUserRepository;
import com.musiclessonshub.repository.SectionRepository;
import com.musiclessonshub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VideoContentService {

    private final CourseRepository courseRepository;
    private final CourseToUserRepository courseToUserRepository;
    private final UserRepository userRepository;
    private final SectionRepository sectionRepository;
    private final AttachmentService attachmentService;

    public Course createVideoContent(CourseBean course, User teacher) {
        Course newCourse = new Course(UUID.randomUUID(), course.getTitle(), course.getAvatar(), course.getDescription(), false, teacher);
        try {
            courseRepository.save(newCourse);
            return newCourse;
        } catch (Exception e) {
            return null;
        }
    }

    public List<Course> getVideoContentsForUser(User user) {
        return courseToUserRepository.findByUser(user).stream().filter(c -> !c.getCourse().isFullCourse()).map(CourseToUser::getCourse).collect(Collectors.toList());
    }

    public List<Course> getVideoContentsForTeacher(User user) {
        return courseRepository.findAllByTeacherAndIsFullCourse(user, false);
    }

    public Course getVideoContentById(String id) {
        return courseRepository.findByCourseId(UUID.fromString(id));
    }

    public CourseToUser addParticipantToVideoContent(String courseId, String studentId) {
        CourseToUser courseToUser = new CourseToUser(UUID.randomUUID(), userRepository.findByUserId(UUID.fromString(studentId)), courseRepository.findByCourseId(UUID.fromString(courseId)));
        courseToUserRepository.save(courseToUser);
        try {
            CourseToUser courseToUser1 = courseToUserRepository.save(courseToUser);
            return courseToUser1;
        } catch (Exception e) {
            return null;
        }
    }

    public List<User> getParticipantsOfVideoContent(String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        List<CourseToUser> list = courseToUserRepository.findByCourse(course);
        List<User> listOfUser = new ArrayList<>();
        for (CourseToUser courseToUser : list) {
            listOfUser.add(courseToUser.getUser());
        }
        return listOfUser;
    }

    public Section addSectionToVideoContent(SectionBean sectionBean, String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        Section parentSection = !sectionBean.getParentSectionId().isEmpty() ? sectionRepository.findBySectionId(UUID.fromString(sectionBean.getParentSectionId())) : null;
        Section newSection = new Section(UUID.randomUUID(), sectionBean.getSectionName(), sectionBean.getDescription(), 1, course, parentSection, null);
        sectionRepository.save(newSection);
        return newSection;
    }

    public List<Section> getParentSections(String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        return sectionRepository.findByCourseAndParentSection(course, null);
    }

    public List<Section> getSubsections(String courseId, String sectionId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        Section section = sectionRepository.findBySectionId(UUID.fromString(sectionId));
        return sectionRepository.findByCourseAndParentSection(course, section);
    }

    public Course getVideoContentByTitle(String courseTitle) {
        return courseRepository.findByTitleAndIsFullCourse(courseTitle, false);
    }

    public Course updateCourse(String courseId, CourseBean course) {
        Course c = this.getVideoContentById(courseId);
        c.setTitle(course.getTitle());
        c.setDescription(course.getDescription());
        c.setAvatar(course.getAvatar());
        courseRepository.save(c);
        return c;
    }

    public void deleteParticipantFromVideoContent(String courseId, String studentId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        User user = userRepository.findByUserId(UUID.fromString(studentId));
        attachmentService.deleteAllForStudentInCourse(studentId, course);
        CourseToUser courseToUserToDelete = courseToUserRepository.findByCourseAndUser(course, user);
        courseToUserRepository.delete(courseToUserToDelete);
    }

    public User getOwnerOfVideoContent(String courseId) {
        return courseRepository.findByCourseId(UUID.fromString(courseId)).getTeacher();
    }

    public int getChildSectionNumber(String courseId, String sectionId) {
        return sectionRepository.findBySectionId(UUID.fromString(sectionId)).getChildSections().size();
    }

    public void deleteVideoContent(String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        List<Section> sections = sectionRepository.findByCourse(course);
        sections.stream().filter(section -> section.getParentSection() != null).forEach(section -> deleteSection(section.getSectionId().toString()));
        sections.stream().filter(section -> section.getParentSection() == null).forEach(section -> deleteSection(section.getSectionId().toString()));
        courseToUserRepository.deleteAll(courseToUserRepository.findByCourse(course));
        courseRepository.delete(course);
    }

    public void deleteSection(String sectionId) {
        attachmentService.deleteAllForSection(sectionId);
        sectionRepository.deleteById(UUID.fromString(sectionId));
    }

    public Section updateSection(SectionBean section, String sectionId) {
        Section updatedSection = sectionRepository.findBySectionId(UUID.fromString(sectionId));
        updatedSection.setDescription(section.getDescription());
        updatedSection.setSection_name(section.getSectionName());
        sectionRepository.save(updatedSection);

        return updatedSection;
    }
}
