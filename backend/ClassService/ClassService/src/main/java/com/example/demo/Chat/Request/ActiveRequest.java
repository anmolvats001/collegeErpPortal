package com.example.demo.Chat.Request;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class ActiveRequest {
    private UUID id;
    private boolean active;
}
