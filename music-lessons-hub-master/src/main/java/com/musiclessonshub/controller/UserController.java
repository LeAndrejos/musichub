package com.musiclessonshub.controller;

import com.musiclessonshub.bean.UserBean;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.model.Salt;
import com.musiclessonshub.model.User;
import com.musiclessonshub.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

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

    @DeleteMapping(value = "/user/{username}")
    public void deleteUser(@RequestHeader("Authorization") String token, @PathVariable("username") String username) {
        String role = RoleConfig.getRoleFromToken(token);
        if (role.equals("ADMIN")) {
            User user = userService.findByUsername(username);
            userService.deleteUser(user);
        }
    }

    @PostMapping(value = "/user/{username}/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestHeader("Authorization") String token, @PathVariable("username") String username) {
        String role = RoleConfig.getRoleFromToken(token);
        if (role.equals("ADMIN")) {
            User user = userService.findByUsername(username);
            String newPassword = userService.resetPassword(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(Collections.singletonMap("password", newPassword));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping(value = "/user/createTeacher")
    public ResponseEntity<?> createTeacher(@RequestHeader("Authorization") String token) {
        String role = RoleConfig.getRoleFromToken(token);
        if(role.equals("ADMIN")) {
            UserBean newTeacher = userService.createTeacher();
            return ResponseEntity.status(HttpStatus.CREATED).body(newTeacher);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
