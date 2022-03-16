package com.musiclessonshub.bean;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

/**
 * This class represents a logged JWT user's credentials.
 *
 */@Getter
@Setter
public class MinimalJwtUser {

    private String username;
    private String role;

    public MinimalJwtUser() {
    }

    public MinimalJwtUser(String username, String role) {
        super();
        this.username = username;
        this.role = role;
    }

}