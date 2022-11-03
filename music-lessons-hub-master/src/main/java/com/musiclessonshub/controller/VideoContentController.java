package com.musiclessonshub.controller;

import com.musiclessonshub.bean.CourseBean;
import com.musiclessonshub.bean.SectionBean;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.CourseToUser;
import com.musiclessonshub.model.Section;
import com.musiclessonshub.model.User;
import com.musiclessonshub.service.UserService;
import com.musiclessonshub.service.VideoContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/video-content")
@RestController
public class VideoContentController {

    private final VideoContentService videoContentService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestHeader("Authorization") String token, @RequestBody CourseBean course) {
        String role = RoleConfig.getRoleFromToken(token);

        String username = RoleConfig.getUsernameFromToken(token);
        if (role != null && role.equals("STUDENT")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User ownerOfCourse = userService.findByUsername(username);

        Course success = videoContentService.createVideoContent(course, ownerOfCourse);
        if (success != null) {
            return ResponseEntity.status(HttpStatus.OK).body(success);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //todo dodać autoryzacje
    @GetMapping
    public ResponseEntity<?> getCourses(@RequestHeader("Authorization") String token) {
        String role = RoleConfig.getRoleFromToken(token);

        String username = RoleConfig.getUsernameFromToken(token);
        User user = userService.findByUsername(username);
        List<Course> courses;
        if (role != null && role.equals("STUDENT")) {
            courses = videoContentService.getVideoContentsForUser(user);
        } else {
            courses = videoContentService.getVideoContentsForTeacher(user);
        }
        return ResponseEntity.status(HttpStatus.OK).body(courses);
    }

    @GetMapping(value = "/{courseId}")
    //sprawdzenie czy ma dostęp
    public ResponseEntity<?> getSelectedCourse(@PathVariable(name = "courseId") String courseId) {
        Course course = videoContentService.getVideoContentById(courseId);
        if (course != null) {
            return ResponseEntity.status(HttpStatus.OK).body(course);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //sprawdzenie czy ma dostęp
    @GetMapping(value = "/{courseId}/showParticipants")
    public ResponseEntity<?> getParticipantsOfCourse(@RequestHeader("Authorization") String token, @PathVariable(name = "courseId") String courseId, @RequestParam(required = false) String admin) {
        List<User> users = videoContentService.getParticipantsOfVideoContent(courseId);
        if (admin.equals("true")) {
            users.add(videoContentService.getOwnerOfVideoContent(courseId));
        }
        String username = RoleConfig.getUsernameFromToken(token);
        users.removeIf(user -> user.getUsername().equals(username));
        if (users != null) {
            return ResponseEntity.status(HttpStatus.OK).body(users);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //sprawdzenie czy ma dostęp
    @PostMapping(value = "/{courseId}/addStudent/{studentId}")
    public ResponseEntity<?> addParticipant(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "studentId") String studentId) {
        CourseToUser courseToUser = videoContentService.addParticipantToVideoContent(courseId, studentId);
        if (courseToUser != null) {
            return ResponseEntity.status(HttpStatus.OK).body(courseToUser);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //todo dodać autoryzacje
    @PostMapping(value = "/{courseId}/section")
    public ResponseEntity<?> addSectionToCourse(@PathVariable(name = "courseId") String courseId, @RequestBody SectionBean section) {
        Section success = videoContentService.addSectionToVideoContent(section, courseId);
        if (success != null) {
            return ResponseEntity.status(HttpStatus.OK).body(success);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping(value = "/{courseId}/section/{sectionId}")
    public ResponseEntity<?> editSection(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "sectionId") String sectionId, @RequestBody SectionBean section) {
        Section success = videoContentService.updateSection(section, sectionId);
        if(success != null) {
            return ResponseEntity.status(HttpStatus.OK).body(success);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //todo dodać autoryzacje
    @GetMapping(value = "/{courseId}/section")
    public ResponseEntity<?> getParentSections(@PathVariable(name = "courseId") String courseId) {
        List<Section> sections = videoContentService.getParentSections(courseId);
        if (sections != null) {
            return ResponseEntity.status(HttpStatus.OK).body(sections);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/{courseId}/section/{sectionId}/subsection")
    public ResponseEntity<?> getSubsections(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "sectionId") String sectionId) {
        List<Section> sections = videoContentService.getSubsections(courseId, sectionId);
        if (sections != null) {
            return ResponseEntity.status(HttpStatus.OK).body(sections);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/title")
    public Course getCourseByTitle(@RequestParam String courseTitle) {
        return videoContentService.getVideoContentByTitle(courseTitle);
    }

    @PutMapping(value = "/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable(name = "courseId") String courseId, @RequestBody CourseBean course) {
        return ResponseEntity.status(HttpStatus.OK).body(videoContentService.updateCourse(courseId, course));
    }

    @DeleteMapping(value = "/{courseId}/deleteStudent/{studentId}")
    public ResponseEntity<?> deleteParticipant(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "studentId") String studentId) {
        videoContentService.deleteParticipantFromVideoContent(courseId, studentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping(value = "/{courseId}/section/{sectionId}/subsection/length")
    public int getChildSectionNumber(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "sectionId") String sectionId) {
        return videoContentService.getChildSectionNumber(courseId, sectionId);
    }

    @DeleteMapping(value = "/{courseId}/section/{sectionId}")
    public void deleteSection(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "sectionId") String sectionId) {
        videoContentService.deleteSection(sectionId);
    }

    @DeleteMapping(value = "/{courseId}")
    public void deleteCourse(@PathVariable(name = "courseId") String courseId) {
        videoContentService.deleteVideoContent(courseId);
    }
}
