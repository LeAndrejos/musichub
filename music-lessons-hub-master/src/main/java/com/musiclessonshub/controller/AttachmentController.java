package com.musiclessonshub.controller;

import com.musiclessonshub.bean.AttachmentBean;
import com.musiclessonshub.model.Attachment;
import com.musiclessonshub.repository.AttachmentRepository;
import com.musiclessonshub.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//@CrossOrigin(origins = "http://34.118.31.153:4200")
@RestController
public class AttachmentController {


    @Autowired
    AttachmentService attachmentService;

    //todo dodac autoryzacje
    @PostMapping(value = "/attachment/{sectionId}")
    public ResponseEntity<?> addAttachment(@PathVariable(name="sectionId") String sectionId, @RequestBody AttachmentBean attachmentBean) {
        Attachment attachment = attachmentService.addAttachment(sectionId,attachmentBean);
        if (attachment != null) {
            return ResponseEntity.status(HttpStatus.OK).body(attachment);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

    }

    @GetMapping(value = "/attachment/{sectionId}")
    public ResponseEntity<?> getAttachments(@PathVariable(name="sectionId") String sectionId){
        List<Attachment> attachments =  attachmentService.getAttachmentsForSection(sectionId);
        if (attachments != null) {
            return ResponseEntity.status(HttpStatus.OK).body(attachments);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping(value = "/attachment/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable(name = "attachmentId") String attachmentId) {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
