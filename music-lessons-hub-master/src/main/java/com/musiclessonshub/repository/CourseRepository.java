package com.musiclessonshub.repository;

import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.Section;
import com.musiclessonshub.model.User;
import org.checkerframework.common.util.report.qual.ReportCreation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
        Course findByCourseId(UUID courseId);
        Course findByTitle(String title);
}
