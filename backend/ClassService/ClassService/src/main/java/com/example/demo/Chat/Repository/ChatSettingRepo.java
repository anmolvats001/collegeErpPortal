package com.example.demo.Chat.Repository;

import com.example.demo.Chat.Entity.ChatSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatSettingRepo extends JpaRepository<ChatSetting, UUID> {

    Optional<ChatSetting> findByConversation_IdAndCollegeId(
            UUID conversationId,
            UUID collegeId
    );
}