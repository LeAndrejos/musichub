package com.musiclessonshub.service;

import com.musiclessonshub.bean.MeetingBean;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.Meeting;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.CourseRepository;
import com.musiclessonshub.repository.MeetingRepository;
import com.musiclessonshub.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Meeting createMeeting(@NotNull MeetingBean meetingBean) {
        User teacher = userRepository.findByUserId(meetingBean.getTeacher());
        User student = userRepository.findByUserId(meetingBean.getStudent());
        Course course = courseRepository.findByCourseId(meetingBean.getCourse());

        Meeting meeting = new Meeting(UUID.randomUUID(), meetingBean.getTitle(), "", meetingBean.getStartTime(), teacher, student, null, course);
        try {
            return meetingRepository.save(meeting);
        } catch (Exception e) {
            return null;
        }
    }

    public List<Meeting> getMeetingsForUserForCourse(String username, String courseId) {
        User user = userRepository.findByUsername(username);
        Course course = courseRepository.findByCourseId(UUID.fromString(courseId));
        try {
            List<Meeting> meetings = meetingRepository.findByStudentAndCourseId(user, course);
            if (!user.getRole().equals("STUDENT")) {
                meetings.addAll(meetingRepository.findByTeacherAndCourseId(user, course));
            }
            meetings.sort(Comparator.comparing(Meeting::getStartTime));
            return meetings;
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public void deleteAllForStudentInCourse(User user, Course course) {
        meetingRepository.deleteAllByStudentAndCourseId(user, course);
    }

    @Transactional
    public void deleteAllForStudent(User user) {
        meetingRepository.deleteAllByStudent(user);
    }

    public void deleteMeeting(String meetingId) {
        meetingRepository.deleteById(UUID.fromString(meetingId));
    }

    public Meeting getMeeting(String meetingId) {
        return meetingRepository.findByMeetingId(UUID.fromString(meetingId));
    }

    @Transactional
    public void deleteAllForCourse(Course course) {
        meetingRepository.deleteAllByCourseId(course);
    }
}
