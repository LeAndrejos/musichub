package com.musiclessonshub.service;

import com.musiclessonshub.bean.UserBean;
import com.musiclessonshub.exception.UsernameTakenException;
import com.musiclessonshub.model.Course;
import com.musiclessonshub.model.Salt;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.CourseRepository;
import com.musiclessonshub.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.awt.desktop.SystemSleepEvent;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;


@Service
@AllArgsConstructor
public class UserService {

    UserRepository userRepository;
    CourseService courseService;
    Salt salt;

    public User findUserByUsernameAndPassword(String username, String password) {
        String pw_hash = BCrypt.hashpw(password, salt.getSalt());
        User user = userRepository.findByUsernameAndPassword(username, pw_hash);
        if (user != null) {
            return user;
        }
        return null;
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
}
