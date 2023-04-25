package com.musiclessonshub.service;

import com.musiclessonshub.bean.UserBean;
import com.musiclessonshub.exception.UsernameTakenException;
import com.musiclessonshub.model.Salt;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.CourseToUserRepository;
import com.musiclessonshub.repository.UserRepository;
import lombok.AllArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@AllArgsConstructor
public class UserService {

    UserRepository userRepository;
    CourseService courseService;
    AttachmentService attachmentService;
    MeetingService meetingService;
    CourseToUserRepository courseToUserRepository;

    Salt salt;

    public User findUserByUsernameAndPassword(String username, String password) {
        String pw_hash = BCrypt.hashpw(password, salt.getSalt());
        return userRepository.findByUsernameAndPassword(username, pw_hash);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findById(String userId) {
        return userRepository.findByUserId(UUID.fromString(userId));
    }

    public User saveUserToDatabase(UserBean user) {
        String pw_hash = BCrypt.hashpw(user.getPassword(), salt.getSalt());
        User newUser = new User(user.getUsername(), pw_hash, "STUDENT");
        newUser.setUserId(UUID.randomUUID());
        try {
            return userRepository.save(newUser);
        } catch (Exception e) {
            throw new UsernameTakenException();
        }

    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user, UserBean userBean) {
        user.setUsername(userBean.getUsername());
        user.setPassword(BCrypt.hashpw(userBean.getPassword(), salt.getSalt()));
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new UsernameTakenException();
        }
    }

    public void deleteUser(User user) {
        meetingService.deleteAllForStudent(user);
        attachmentService.deleteAllForStudent(user);
        courseToUserRepository.deleteAll(courseToUserRepository.findByUser(user));
        userRepository.delete(user);
    }

    public UserBean createTeacher() {
        String password = RandomString.make();
        String username = RandomString.make();
        String encryptedPassword = BCrypt.hashpw(password, salt.getSalt());
        User newTeacher = new User(UUID.randomUUID(), username, encryptedPassword, "TEACHER");

        try {
            userRepository.save(newTeacher);
            return new UserBean(username, password);
        } catch (Exception e) {
            throw new UsernameTakenException();
        }
    }

    public String resetPassword(User user) {
        String password = RandomString.make();
        String encryptedPassword = BCrypt.hashpw(password, salt.getSalt());
        user.setPassword(encryptedPassword);
        userRepository.save(user);
        return password;
    }
}
