package com.musiclessonshub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "meetings", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Meeting {
    @Id
    @Column(name="meeting_id")
    private UUID meetingId;
    @Column
    private String title;
    @Column
    private String data; // <- tutaj zrobic dane
    @Column
    private Date startTime;
    @OneToOne
    private User teacher;
    @OneToOne
    private User student;
    @ManyToOne
    @JoinColumn(name="attachment_id")
    private Attachment attachment;
    @ManyToOne
    @JoinColumn(name="course_id")
    private Course courseId;
}
