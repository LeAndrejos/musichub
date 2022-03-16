package com.musiclessonshub.bean;

import com.musiclessonshub.model.Message;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MessageBean {
    private String message_id;
    private String sender;
    private String recipient;
    private String content;
    private Date date;

    public MessageBean(Message message) {
        this.message_id = message.getMessage_id().toString();
        this.sender = message.getSender().getUserId().toString();
        this.recipient = message.getRecipient().getUserId().toString();
        this.content = message.getContent();
        this.date = message.getDate();
    }
}
