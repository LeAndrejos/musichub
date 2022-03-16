package com.musiclessonshub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlerAdvice {

    @ExceptionHandler(UsernameTakenException.class)
    public ResponseEntity<?> handleException(UsernameTakenException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already is taken.");
    }
}
