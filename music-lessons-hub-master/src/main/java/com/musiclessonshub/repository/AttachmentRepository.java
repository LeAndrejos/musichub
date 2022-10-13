package com.musiclessonshub.repository;

import com.musiclessonshub.model.Attachment;
import com.musiclessonshub.model.Section;
import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
    List<Attachment> findBySectionId(Section sectionId);
    Attachment findByAttachmentId(UUID attachmentId);
    List<Attachment> findAllByUserAndSectionId(User user, Section section);
    List<Attachment> findAllByUser(User user);
}
