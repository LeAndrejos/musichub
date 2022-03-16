package com.musiclessonshub.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.musiclessonshub.bean.MessageBean;
import com.musiclessonshub.model.Message;
import com.musiclessonshub.model.User;
import com.musiclessonshub.repository.MessageRepository;
import com.musiclessonshub.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public void saveMessage(String message){
        JsonObject object = JsonParser.parseString(message).getAsJsonObject();
        Message m = new Message();
        m.setMessage_id(UUID.randomUUID());
        User sender = userRepository.findByUserId(UUID.fromString(object.get("data").getAsJsonObject().get("fromId").getAsString()));
        User recipient = userRepository.findByUserId(UUID.fromString(object.get("data").getAsJsonObject().get("toId").getAsString()));
        m.setSender(sender);
        m.setRecipient(recipient);
        m.setContent(object.get("data").getAsJsonObject().get("message").getAsString());
        String date = object.get("data").getAsJsonObject().get("dateSent").getAsString();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneId.systemDefault());
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(date, formatter);
        m.setDate(Date.from(zonedDateTime.toInstant()));
        messageRepository.save(m);
    }

    public List<MessageBean> getMessagesForUsers(List<String> users){
        User user1 = userRepository.findByUserId(UUID.fromString(users.get(0)));
        User user2 = userRepository.findByUserId(UUID.fromString(users.get(1)));

        List<Message> messages = messageRepository.findAllBySenderAndRecipient(user1, user2);
        messages.addAll(messageRepository.findAllBySenderAndRecipient(user2, user1));

        messages.sort(Comparator.comparing(Message::getDate));

        return messages.stream().map(MessageBean::new).collect(Collectors.toList());
    }

}
