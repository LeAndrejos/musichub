package com.musiclessonshub.service;

import com.musiclessonshub.bean.AttachmentBean;
import com.musiclessonshub.model.Attachment;
import com.musiclessonshub.model.Section;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.AttachmentRepository;
import com.musiclessonshub.repository.SectionRepository;
import com.musiclessonshub.repository.UserRepository;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    SectionRepository sectionRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    FileService fileService;

    public Attachment addAttachment(String sectionId, AttachmentBean attachmentBean){
        Section section = sectionRepository.findBySectionId(UUID.fromString(sectionId));
        User user = userRepository.findByUserId(UUID.fromString(attachmentBean.getUser()));
        Attachment attachment = new Attachment(UUID.randomUUID(),attachmentBean.getType(),attachmentBean.getContent(),section, user);
        try{
            Attachment attachment1 = attachmentRepository.save(attachment);
            return attachment1;
        }catch (Exception e){
            return null;
        }

    }

    public List<Attachment> getAttachmentsForSection(String sectionId){
        return attachmentRepository.findBySectionId(sectionRepository.findBySectionId(UUID.fromString(sectionId)));
    }

    public String getFileNameForAttachment(String attachmentId) {
        Attachment attachment = attachmentRepository.findByAttachmentId(UUID.fromString(attachmentId));
        return attachment.getSectionId().getCourse().getTitle()+"_"+attachment.getContent();
    }

    public void deleteAttachment(String attachmentId) {
        fileService.deleteFile(attachmentId);
        attachmentRepository.deleteById(UUID.fromString(attachmentId));
    }

}
