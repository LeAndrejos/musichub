package com.musiclessonshub.service;

import com.musiclessonshub.bean.CourseBean;
import com.musiclessonshub.bean.SectionBean;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.CourseToUser;
import com.musiclessonshub.model.Section;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.CourseRepository;
import com.musiclessonshub.repository.CourseToUserRepository;
import com.musiclessonshub.repository.SectionRepository;
import com.musiclessonshub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class CourseService {

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    CourseToUserRepository courseToUserRepository;

    @Autowired
    UserRepository userRepository;
    @Autowired
    SectionRepository sectionRepository;

    public Course createCourse(CourseBean course, User teacher) {
        Course newCourse = new Course(UUID.randomUUID(), course.getTitle(), course.getAvatar(), course.getDescription(), teacher);
        try {
            courseRepository.save(newCourse);
            return newCourse;
        } catch (Exception e) {
            return null;
        }

    }

    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getCoursesForUser(User user) {
        return courseToUserRepository.findByUser(user).stream().map(CourseToUser::getCourse).collect(Collectors.toList());
    }

    public Course getCourseById(String id) {
        return courseRepository.findByCourseId(UUID.fromString(id));
    }

    public CourseToUser addParticipantToCourse(String courseId, String studentId) {
        CourseToUser courseToUser = new CourseToUser(UUID.randomUUID(), userRepository.findByUserId(UUID.fromString(studentId)), courseRepository.findByCourseId(UUID.fromString(courseId)));
        courseToUserRepository.save(courseToUser);
        try {
            CourseToUser courseToUser1 = courseToUserRepository.save(courseToUser);
            return courseToUser1;
        } catch (Exception e) {
            return null;
        }
    }

    public List<User> getParticipantsOfCourse(String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        List<CourseToUser> list = courseToUserRepository.findByCourse(course);
        List<User> listOfUser = new ArrayList<>();
        for (CourseToUser courseToUser : list) {
            listOfUser.add(courseToUser.getUser());
        }
        return listOfUser;
    }

    public Section addSectionToCourse(SectionBean sectionBean, String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        Section newSection = new Section(UUID.randomUUID(), sectionBean.getSectionName(), sectionBean.getDescription(), 1, course);
        sectionRepository.save(newSection);
        return newSection;
    }

    public List<Section> getSections(String courseId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        return sectionRepository.findByCourse(course);
    }

    public Course getCourseByTitle(String courseTitle) {
        return courseRepository.findByTitle(courseTitle);
    }

    public Course updateCourse(String courseId, CourseBean course) {
        Course c = this.getCourseById(courseId);
        c.setTitle(course.getTitle());
        c.setDescription(course.getDescription());
        c.setAvatar(course.getAvatar());
        courseRepository.save(c);
        return c;
    }

    public void deleteParticipantFromCourse(String courseId, String studentId) {
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        User user = userRepository.findByUserId(UUID.fromString(studentId));
        CourseToUser courseToUserToDelete = courseToUserRepository.findByCourseAndUser(course, user);
        courseToUserRepository.delete(courseToUserToDelete);
    }

    public User getOwnerOfCourse(String courseId) {
        return courseRepository.findByCourseId(UUID.fromString(courseId)).getTeacher();
    }

}
