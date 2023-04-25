package com.musiclessonshub.repository;

import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.CourseToUser;
import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface CourseToUserRepository  extends JpaRepository<CourseToUser, UUID> {
    List<CourseToUser> findByCourse(Course course);
    List<CourseToUser> findByCourseAndIsParticipant(Course course, boolean isParticipant);
    List<CourseToUser> findByUserAndIsParticipant(User user, boolean isParticipant);
    List<CourseToUser> findByUser(User user);
    CourseToUser findByCourseAndUser(Course course, User user);
}
