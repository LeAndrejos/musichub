package com.musiclessonshub.controller;

import com.musiclessonshub.bean.AuthenticatedUserResponse;
import com.musiclessonshub.bean.AuthenticationBean;
import com.musiclessonshub.bean.MinimalJwtUser;
import com.musiclessonshub.configuration.RoleConfig;
import com.musiclessonshub.model.User;
import com.musiclessonshub.service.JwtService;
import com.musiclessonshub.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
//@CrossOrigin(origins = "http://34.118.31.153:4200")
public class JwtAuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @PostMapping(value = "/user/auth")
    public ResponseEntity<?> auth(@RequestBody AuthenticationBean auth, HttpServletResponse response) {
        String username = auth.getUsername();
        String password = auth.getPassword();

        User user = this.userService.findUserByUsernameAndPassword(username, password);

        if (user != null) {
            Date now = new Date();
            Long expireInMilis = TimeUnit.HOURS.toMillis(100);


            String token = Jwts.builder()
                    .setSubject(user.getUsername()) // 1
                    .claim("roles", user.getRole()) // 2
                    .setIssuedAt(now) // 3
                    .setExpiration(new Date(expireInMilis + now.getTime())) // 4
                    .signWith(SignatureAlgorithm.HS512, JwtService.secret).compact();

            MinimalJwtUser jwtUser = new MinimalJwtUser(user.getUsername(),
                    user.getRole());

            AuthenticatedUserResponse res = new AuthenticatedUserResponse();
            res.setToken(token);
            res.setUser(user);

            return ResponseEntity.ok(res);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping(value = "/user/auth")
    public boolean isTokenValid(@RequestParam String token) {
        return RoleConfig.isTokenValid(token);
    }
}
