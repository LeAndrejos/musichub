package com.musiclessonshub.bean;

import com.musiclessonshub.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticatedUserResponse {
    User user;
    String token;
}
