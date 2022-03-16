package com.musiclessonshub.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationBean {

    private String username;
    private String password;

    public AuthenticationBean(){}

    public AuthenticationBean(String username, String password) {
        this.username = username;
        this.password = password;
    }

}
