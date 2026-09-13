package com.example.demo.Chat.Repository;

import com.example.demo.Chat.Entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepo extends JpaRepository<Message, UUID> {

    Page<Message> findByConversation_IdAndCollegeId(
            UUID conversationId,
            UUID collegeId,
            Pageable pageable
    );

    Page<Message> findByConversation_IdAndConversationMember_IdAndCollegeId(
            UUID conversationId,
            UUID memberId,
            UUID collegeId,
            Pageable pageable
    );
}