package com.musiclessonshub.repository;

import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.Meeting;
import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, UUID> {
    List<Meeting> findByTeacherAndCourseId(User teacher, Course course);
    List<Meeting> findByStudentAndCourseId(User student, Course course);
    Meeting findByMeetingId(UUID meetingId);
    void deleteAllByStudentAndCourseId(User student, Course course);
    void deleteAllByStudent(User student);
    void deleteAllByCourseId(Course course);
}
