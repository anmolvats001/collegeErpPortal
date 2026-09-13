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
public class FileResponse {
    private UUID fileId;
    private String publicId;
    private String originalFileName;
    private String resourceType;
    private String mimeType;
    private Long size;
    private String secureUrl;
    private String folder;
    private String ownerId;
    private String entityType;
    private String entityId;
    private LocalDateTime createdAt;
}
