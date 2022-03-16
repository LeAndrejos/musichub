package com.musiclessonshub.repository;

import com.musiclessonshub.model.Chat;
import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    Chat findByChatId(UUID chatId);
    Chat findByFirstUserAndSecondUser(User firstUser, User secondUser);
}
