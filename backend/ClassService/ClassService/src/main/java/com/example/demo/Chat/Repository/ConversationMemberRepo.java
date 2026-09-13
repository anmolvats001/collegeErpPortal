package com.example.demo.Chat.Repository;

import com.example.demo.Chat.Entity.ConversationMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationMemberRepo extends JpaRepository<ConversationMember, UUID> {

    List<ConversationMember> findByConversation_IdAndCollegeId(
            UUID conversationId,
            UUID collegeId
    );

    List<ConversationMember> findByConversation_IdAndIsActiveTrueAndCollegeId(
            UUID conversationId,
            UUID collegeId
    );

    Optional<ConversationMember> findByConversation_IdAndUserIdAndCollegeId(
            UUID conversationId,
            String userId,
            UUID collegeId
    );

    boolean existsByConversation_IdAndUserIdAndCollegeId(
            UUID conversationId,
            String userId,
            UUID collegeId
    );

    boolean existsByConversation_IdAndUserIdAndIsActiveTrueAndCollegeId(
            UUID conversationId,
            String userId,
            UUID collegeId
    );

    List<ConversationMember> findByUserIdAndCollegeId(
            String userId,
            UUID collegeId
    );
    Optional<ConversationMember> findByIdAndCollegeId(UUID id, UUID collegeId);
    List<ConversationMember> findByUserIdAndIsActiveTrueAndCollegeId(
            String userId,
            UUID collegeId
    );
}