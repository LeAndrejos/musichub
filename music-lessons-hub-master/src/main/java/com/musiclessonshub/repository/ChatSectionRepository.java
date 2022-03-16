package com.musiclessonshub.repository;

import com.musiclessonshub.model.Chat;
import com.musiclessonshub.model.ChatAttachment;
import com.musiclessonshub.model.ChatAttachmentSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatSectionRepository extends JpaRepository<ChatAttachmentSection, UUID> {
    List<ChatAttachmentSection> findByChatId(Chat chat);
    ChatAttachmentSection findByChatAttachmentSectionId(UUID chatAttachmentSectionId);
}
