package com.example.demo.Chat.Request;

import com.example.demo.Chat.Entity.MemberType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ConversationMemberRequest {

    @NotNull
    private UUID conversationId;

    @NotNull
    private String userId;

    @NotNull
    private MemberType memberType;
}