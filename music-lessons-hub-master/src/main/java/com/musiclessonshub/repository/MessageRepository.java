package com.musiclessonshub.repository;

import com.musiclessonshub.model.Message;
import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findAllBySenderAndRecipient(User sender, User recipient);
}
