package com.example.demo.Chat.Request;

import com.example.demo.Chat.Entity.Message.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class MessageRequest {

    @NotNull
    private UUID conversationId;
    @NotNull
    private MessageType messageType;

    @NotBlank
    private String message;
}