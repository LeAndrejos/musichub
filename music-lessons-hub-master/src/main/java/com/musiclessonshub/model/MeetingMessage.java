package com.musiclessonshub.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "meetingmessages", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingMessage {
    @Id
    private UUID meeting_id;
    @ManyToOne
    @JoinColumn(name="user_id")
    private User creator;
    @Column
    private String content; // <- tutaj zrobic dane
    @Column
    private Date date;
}
