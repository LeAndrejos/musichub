package com.musiclessonshub.controller;

import com.musiclessonshub.bean.AttachmentBean;
import com.musiclessonshub.model.Attachment;
import com.musiclessonshub.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/attachment")
@RestController
public class AttachmentController {

    private final AttachmentService attachmentService;

    //todo dodac autoryzacje
    @PostMapping(value = "/{sectionId}")
    public ResponseEntity<?> addAttachment(@PathVariable(name="sectionId") String sectionId, @RequestBody AttachmentBean attachmentBean) {
        Attachment attachment = attachmentService.addAttachment(sectionId,attachmentBean);
        if (attachment != null) {
            return ResponseEntity.status(HttpStatus.OK).body(attachment);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

    }

    @GetMapping(value = "/attachment/{attachmentId}")
    public ResponseEntity<?> getAttachment(@PathVariable(name="attachmentId") String attachmentId) {
        Attachment attachment = attachmentService.getAttachment(attachmentId);
        if (attachment != null) {
            return ResponseEntity.status(HttpStatus.OK).body(attachment);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

    }

    @GetMapping(value = "/{sectionId}")
    public ResponseEntity<?> getAttachments(@PathVariable(name="sectionId") String sectionId){
        List<Attachment> attachments =  attachmentService.getAttachmentsForSection(sectionId);
        if (attachments != null) {
            return ResponseEntity.status(HttpStatus.OK).body(attachments);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping(value = "/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable(name = "attachmentId") String attachmentId) {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
