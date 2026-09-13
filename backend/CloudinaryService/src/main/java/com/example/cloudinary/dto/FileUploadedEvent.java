package com.example.cloudinary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadedEvent {
    private String eventType;
    private UUID fileId;
    private String publicId;
    private String secureUrl;
    private String originalFileName;
    private String mimeType;
    private Long size;
    private String resourceType;
    private String ownerId;
    private String entityType;
    private String entityId;
    private LocalDateTime uploadedAt;
}
