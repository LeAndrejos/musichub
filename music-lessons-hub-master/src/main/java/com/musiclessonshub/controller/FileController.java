package com.musiclessonshub.controller;

import com.google.api.client.util.IOUtils;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.minio.MusicHubMinioClient;
import com.musiclessonshub.model.ChatAttachment;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.User;
import com.musiclessonshub.service.ChatAttachmentService;
import com.musiclessonshub.service.CourseService;
import com.musiclessonshub.service.FileService;
import com.musiclessonshub.service.UserService;
import io.minio.errors.ErrorResponseException;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
//@CrossOrigin(origins = "http://34.118.31.153:4200")
public class FileController {

    private final MusicHubMinioClient client;
    private final FileService fileService;
    private final UserService userService;
    private final ChatAttachmentService chatAttachmentService;
    private final CourseService courseService;

    @GetMapping("/{object}")
    public void getFile(@PathVariable("object") String object, HttpServletResponse response) throws Exception {
        try {
            InputStream inputStream;
            inputStream = client.getFileContent(object);

            response.addHeader("Content-disposition", "attachement;filename=" + object);
            response.setContentType(URLConnection.guessContentTypeFromName(object));
            IOUtils.copy(inputStream, response.getOutputStream());
            response.flushBuffer();
        } catch (ErrorResponseException e) {
            System.err.println("Object " + object + " not found");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object " + object + " not found.");
        }
    }

    @GetMapping("/{object}/size")
    public ResponseEntity<?> getFileSize(@PathVariable("object") String object) throws Exception{
        return ResponseEntity.status(HttpStatus.OK).body(fileService.getObjectSize(object));
    }

    @PostMapping("/{attachmentId}")
    public ResponseEntity<?> saveFile(@RequestHeader("Authorization") String token, @RequestBody MultipartFile file, @PathVariable("attachmentId") String attachmentId) {
        String role = RoleConfig.getRoleFromToken(token);

        String username = RoleConfig.getUsernameFromToken(token);

        User user = userService.findByUsername(username);
        fileService.saveFile(file, user, attachmentId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> saveAvatar(@RequestHeader("Authorization") String token, @RequestBody MultipartFile file, @PathVariable("attachmentId") String attachmentId) {
        String role = RoleConfig.getRoleFromToken(token);

        String username = RoleConfig.getUsernameFromToken(token);
        if(role== null ){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByUsername(username);
        fileService.saveAvatar(file, user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    //todo add authentication, something is wrong
    @PostMapping("/attachment/{sectionId}")
    public ResponseEntity<?> postChatAttachment(@RequestBody MultipartFile file, @PathVariable("sectionId") String sectionId) {
        ChatAttachment chatAttachment = chatAttachmentService.postAttachment(sectionId,file.getName());

        fileService.saveAttachment(file, chatAttachment);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    //todo add authorization
    @DeleteMapping("/{object}")
    public void deleteFile(@PathVariable String object) {
        client.deleteFile(object);
    }
}

