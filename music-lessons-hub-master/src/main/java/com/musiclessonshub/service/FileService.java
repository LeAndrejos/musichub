package com.musiclessonshub.service;


import com.musiclessonshub.minio.MusicHubMinioClient;
import com.musiclessonshub.model.Attachment;
import com.musiclessonshub.model.ChatAttachment;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.AttachmentRepository;
import com.musiclessonshub.repository.CourseRepository;
import com.musiclessonshub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    private final MusicHubMinioClient client;
    private final AttachmentRepository attachmentRepository;

    public void saveFile(MultipartFile file, User user, String attachmentId){
        Attachment attachment = attachmentRepository.findByAttachmentId(UUID.fromString(attachmentId));

        client.uploadFile(file,attachment.getAttachmentId().toString());
    }

    public void saveAvatar(MultipartFile file, User user){

        client.uploadFile(file,"Avatar_"+user.getUserId());
    }

    public void saveAttachment(MultipartFile file, ChatAttachment chatAttachment){

        client.uploadFile(file,"ChatAttachment_"+chatAttachment.getChat_attachment_id());
    }

    public void saveUserFile(MultipartFile file, User user, Course course){
        String filename = user.getUsername() + "_" + course.getTitle() + "_" + LocalDateTime.now().toString();
        client.uploadFile(file, filename);
    }

    public void deleteFile(String id) {
        client.deleteFile(id);
    }

    public long getObjectSize(String id) throws Exception{
        return client.getObjectStat(id);
    }
}
