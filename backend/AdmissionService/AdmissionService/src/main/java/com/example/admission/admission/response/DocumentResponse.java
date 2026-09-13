package com.example.admission.admission.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class DocumentResponse {
    private UUID id, applicationId;
    private String documentType, fileName, fileUrl;
    private LocalDateTime uploadedAt;
    private Boolean verified;
}
