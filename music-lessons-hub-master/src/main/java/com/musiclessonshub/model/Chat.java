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
@Table(name = "chats", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @Column(name = "chat_id")
    private UUID chatId;
    @ManyToOne
    @JoinColumn(name="first_user_id")
    private User firstUser;

    @ManyToOne
    @JoinColumn(name="second_user_id")
    private User secondUser;

}
