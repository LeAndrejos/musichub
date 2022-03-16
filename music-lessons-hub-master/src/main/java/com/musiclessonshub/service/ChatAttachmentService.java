package com.musiclessonshub.service;


import com.musiclessonshub.model.ChatAttachment;
import com.musiclessonshub.model.ChatAttachmentSection;
import com.musiclessonshub.repository.ChatAttachmentRepository;
import com.musiclessonshub.repository.ChatSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChatAttachmentService {
    @Autowired
    ChatAttachmentRepository chatAttachmentRepository;

    @Autowired
    ChatSectionRepository chatSectionRepository;

    public List<ChatAttachment> getAttachmentsByChatSection(String sectionId){
        ChatAttachmentSection chatAttachmentSection = chatSectionRepository.findByChatAttachmentSectionId(UUID.fromString(sectionId));
        return chatAttachmentRepository.findByChatAttachmentSectionId(chatAttachmentSection);
    }


    public ChatAttachment postAttachment(String sectionId, String name){
        ChatAttachmentSection chatAttachmentSection = chatSectionRepository.findByChatAttachmentSectionId(UUID.fromString(sectionId));
        try{
            return chatAttachmentRepository.save(new ChatAttachment(UUID.randomUUID(),chatAttachmentSection,name));
        }catch (Exception e){
            return null;
        }
    }

}
