package com.example.demo.Chat.Repository;

import com.example.demo.Chat.Entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepo
        extends JpaRepository<Conversation, UUID> {
    Optional<Conversation> findByIdAndCollegeId(UUID id, UUID collegeId);
    Optional<Conversation> findByClassEntity_IdAndCollegeId(UUID classId,UUID collegeId);
    List<Conversation> findByCollegeId(UUID collegeId);
    boolean existsByClassEntity_Id(UUID classId);
    List<Conversation> findByClassEntity_Branch_IdAndCollegeId(UUID id, UUID collegeId);
}
