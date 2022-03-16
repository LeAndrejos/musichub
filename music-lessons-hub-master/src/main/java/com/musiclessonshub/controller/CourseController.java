package com.musiclessonshub.controller;


import com.musiclessonshub.bean.CourseBean;
import com.musiclessonshub.bean.SectionBean;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.CourseToUser;
import com.musiclessonshub.model.Section;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.UserRepository;
import com.musiclessonshub.service.CourseService;
import com.musiclessonshub.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sound.midi.SysexMessage;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
//@CrossOrigin(origins = "http://34.118.31.153:4200")
public class CourseController {

    private final UserService userService;
    private final CourseService courseService;

    @PostMapping(value = "/course")
    public ResponseEntity<?> createCourse(@RequestHeader("Authorization") String token, @RequestBody CourseBean course) {
        String role = RoleConfig.getRoleFromToken(token);

        String username = RoleConfig.getUsernameFromToken(token);
        if (role != null && role.equals("STUDENT")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User ownerOfCourse = userService.findByUsername(username);

        Course success = courseService.createCourse(course, ownerOfCourse);
        if (success != null) {
            return ResponseEntity.status(HttpStatus.OK).body(success);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //todo dodać autoryzacje
    @GetMapping(value = "/course")
    public ResponseEntity<?> getCourses(@RequestHeader("Authorization") String token) {
        String role = RoleConfig.getRoleFromToken(token);

        String username = RoleConfig.getUsernameFromToken(token);
        if (role != null && role.equals("STUDENT")) {
            User user = userService.findByUsername(username);
            List<Course> courses = courseService.getCoursesForUser(user);
            return ResponseEntity.status(HttpStatus.OK).body(courses);
        } else if (role != null) {
            List<Course> courses = courseService.getCourses();
            return ResponseEntity.status(HttpStatus.OK).body(courses);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/course/{courseId}")
    //sprawdzenie czy ma dostęp
    public ResponseEntity<?> getSelectedCourse(@PathVariable(name = "courseId") String courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course != null) {
            return ResponseEntity.status(HttpStatus.OK).body(course);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //sprawdzenie czy ma dostęp
    @GetMapping(value = "/course/{courseId}/showParticipants")
    public ResponseEntity<?> getParticipantsOfCourse(@RequestHeader("Authorization") String token, @PathVariable(name = "courseId") String courseId, @RequestParam(required = false) String admin) {
        List<User> users = courseService.getParticipantsOfCourse(courseId);
        if (admin.equals("true")) {
            users.add(courseService.getOwnerOfCourse(courseId));
        }
        String username = RoleConfig.getUsernameFromToken(token);
        users.removeIf(user -> user.getUsername().equals(username));
        if (users != null) {
            return ResponseEntity.status(HttpStatus.OK).body(users);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //sprawdzenie czy ma dostęp
    @PostMapping(value = "/course/{courseId}/addStudent/{studentId}")
    public ResponseEntity<?> addParticipant(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "studentId") String studentId) {
        CourseToUser courseToUser = courseService.addParticipantToCourse(courseId, studentId);
        if (courseToUser != null) {
            return ResponseEntity.status(HttpStatus.OK).body(courseToUser);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //todo dodać autoryzacje
    @PostMapping(value = "/course/{courseId}/section")
    public ResponseEntity<?> addSectionToCourse(@PathVariable(name = "courseId") String courseId, @RequestBody SectionBean section) {
        Section success = courseService.addSectionToCourse(section, courseId);
        if (success != null) {
            return ResponseEntity.status(HttpStatus.OK).body(success);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    //todo dodać autoryzacje
    @GetMapping(value = "/course/{courseId}/section")
    public ResponseEntity<?> getSections(@PathVariable(name = "courseId") String courseId) {
        List<Section> sections = courseService.getSections(courseId);
        if (sections != null) {
            return ResponseEntity.status(HttpStatus.OK).body(sections);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/course/title")
    public Course getCourseByTitle(@RequestParam String courseTitle) {
        return courseService.getCourseByTitle(courseTitle);
    }

    @PutMapping(value = "/course/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable(name = "courseId") String courseId, @RequestBody CourseBean course) {
        return ResponseEntity.status(HttpStatus.OK).body(courseService.updateCourse(courseId, course));
    }

    @DeleteMapping(value = "/course/{courseId}/deleteStudent/{studentId}")
    public ResponseEntity<?> deleteParticipant(@PathVariable(name = "courseId") String courseId, @PathVariable(name = "studentId") String studentId) {
        courseService.deleteParticipantFromCourse(courseId, studentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
