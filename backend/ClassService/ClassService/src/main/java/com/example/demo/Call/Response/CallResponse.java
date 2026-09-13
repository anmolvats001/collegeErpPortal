package com.example.demo.Call.Response;

import com.example.demo.Call.Entity.CallStatus;
import com.example.demo.Call.Entity.CallType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CallResponse {

    private UUID callId;

    private String createdBy;

    private CallType callType;

    private CallStatus status;

    private String joinCode;

    private String meetingLink;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;
}