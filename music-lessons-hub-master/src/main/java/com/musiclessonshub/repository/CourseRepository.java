package com.musiclessonshub.repository;

import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    Course findByCourseId(UUID courseId);

    Course findByTitleAndIsFullCourse(String title, boolean isFullCourse);

    List<Course> findAllByTeacherAndIsFullCourse(User teacher, boolean isFullCourse);


}
