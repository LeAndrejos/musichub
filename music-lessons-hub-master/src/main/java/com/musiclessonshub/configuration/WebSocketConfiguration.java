package com.musiclessonshub.configuration;

import com.musiclessonshub.component.ChatSocketHandler;
import com.musiclessonshub.component.SocketHandler;
import com.musiclessonshub.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Autowired
    MessageService messageService;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new SocketHandler(), "/socket").setAllowedOrigins("*");
        registry.addHandler(new ChatSocketHandler(this.messageService), "/chat").setAllowedOrigins("*");
    }
}
