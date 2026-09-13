package com.example.demo.Chat.Response;

import com.example.demo.Chat.Entity.Message.MessageType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private UUID id;

    private UUID conversationId;

    private UUID conversationMemberId;

    private String userId;

    private MessageType messageType;

    private String message;

    private LocalDateTime createdAt;

    private UUID collegeId;
}