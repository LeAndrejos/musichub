package com.musiclessonshub.controller;

import com.musiclessonshub.bean.MessageBean;
import com.musiclessonshub.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/message")
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/history")
    public List<MessageBean> getMessageHistory(@RequestParam List<String> users) {
        return messageService.getMessagesForUsers(users);
    }
}
