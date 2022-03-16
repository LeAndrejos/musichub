package com.musiclessonshub.repository;

import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
    Section findBySectionId(UUID sectionId);
    List<Section> findByCourse(Course courseId);
}
