package com.musiclessonshub.controller;

import com.musiclessonshub.bean.UserBean;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.model.Salt;
import com.musiclessonshub.model.User;
import com.musiclessonshub.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class UserController {

    UserService userService;
    Salt salt;

    @PostMapping(value = "/user")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> createUser(@RequestBody UserBean user) {
        User newUser = userService.saveUserToDatabase(user);
        if (newUser != null) {
            return ResponseEntity.status(HttpStatus.OK).body(newUser);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/user")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping(value = "/user/{username}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public User getUser(@PathVariable("username") String username) {
        return userService.findByUsername(username);
    }

    @GetMapping(value = "/user/id/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public User getUserById(@PathVariable("id") String id) {
        return userService.findById(id);
    }

    @PutMapping(value = "/user")
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String token, @RequestBody UserBean userBean) {
        String username = RoleConfig.getUsernameFromToken(token);
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User updatedUser = userService.updateUser(user, userBean);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
    }

}
