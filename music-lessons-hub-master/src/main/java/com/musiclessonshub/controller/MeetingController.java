package com.musiclessonshub.controller;

import com.musiclessonshub.bean.MeetingBean;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.model.Meeting;
import com.musiclessonshub.service.MeetingService;
import com.musiclessonshub.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/meeting")
//@CrossOrigin(origins = "http://34.118.31.153:4200")
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping(value = "/create")
    public ResponseEntity<?> createMeeting(@RequestBody MeetingBean meetingBean) {
        Meeting meeting = meetingService.createMeeting(meetingBean);
        if (meeting != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(meeting);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping
    public List<Meeting> getMeetingsForUserForCourse(@RequestHeader("Authorization") String token, @RequestParam String courseId) {
        String username = RoleConfig.getUsernameFromToken(token);

        return meetingService.getMeetingsForUserForCourse(username, courseId);
    }

    @GetMapping(value = "/{meetingId}")
    public Meeting getMeeting(@PathVariable(name = "meetingId") String meetingId) {
        return meetingService.getMeeting(meetingId);
    }
}
