package com.example.demo.Chat.Interceptor;

import lombok.Getter;

import java.security.Principal;
import java.util.UUID;

@Getter
public class ChatPrincipal implements Principal {

    private final String userId;
    private final UUID collegeId;

    public ChatPrincipal(
            String userId,
            UUID collegeId
    ) {
        this.userId = userId;
        this.collegeId = collegeId;
    }

    @Override
    public String getName() {
        return userId;
    }
}