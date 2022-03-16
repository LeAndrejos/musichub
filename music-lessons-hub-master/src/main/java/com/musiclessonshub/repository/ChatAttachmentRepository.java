package com.musiclessonshub.repository;

import com.musiclessonshub.model.ChatAttachment;
import com.musiclessonshub.model.ChatAttachmentSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatAttachmentRepository extends JpaRepository<ChatAttachment, UUID> {
    List<ChatAttachment> findByChatAttachmentSectionId(ChatAttachmentSection chatAttachmentSection);
}
