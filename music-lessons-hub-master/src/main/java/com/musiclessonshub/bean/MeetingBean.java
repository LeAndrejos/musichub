package com.musiclessonshub.bean;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class MeetingBean {
    private String title;
    private Date startTime;
    private UUID teacher;
    private UUID student;
    private UUID course;
}
