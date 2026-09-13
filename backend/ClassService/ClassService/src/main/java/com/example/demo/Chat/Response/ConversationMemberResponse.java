package com.example.demo.Chat.Response;

import com.example.demo.Chat.Entity.MemberType;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationMemberResponse {

    private UUID id;

    private UUID conversationId;

    private String userId;

    private MemberType memberType;

    private UUID collegeId;

    private Boolean isActive;
}