package com.musiclessonshub.repository;

import com.musiclessonshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
    User findByUserId(UUID id);
    User findByUsernameAndPassword(String username,String password);

}
