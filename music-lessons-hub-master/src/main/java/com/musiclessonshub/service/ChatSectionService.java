package com.musiclessonshub.service;


import com.musiclessonshub.model.Chat;
import com.musiclessonshub.model.ChatAttachmentSection;
import com.musiclessonshub.repository.ChatRepository;
import com.musiclessonshub.repository.ChatSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChatSectionService {
    @Autowired
    ChatRepository chatRepository;

    @Autowired
    ChatSectionRepository chatSectionRepository;


    public boolean postSection(String chatId, String sectionName){
        Chat chat = chatRepository.findByChatId(UUID.fromString(chatId));
        try{
            chatSectionRepository.save(new ChatAttachmentSection(UUID.randomUUID(),chat,sectionName));
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public List<ChatAttachmentSection> getSections(String chatId){
        Chat chat = chatRepository.findByChatId(UUID.fromString(chatId));
        return chatSectionRepository.findByChatId(chat);
    }
}
