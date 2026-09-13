package com.example.cloudinary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "file_metadata", indexes = {
        @Index(name = "idx_file_owner", columnList = "owner_id"),
        @Index(name = "idx_file_entity", columnList = "entity_type, entity_id"),
        @Index(name = "idx_file_public_id", columnList = "public_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "public_id", nullable = false, unique = true, length = 500)
    private String publicId;

    @Column(name = "original_file_name", nullable = false, length = 500)
    private String originalFileName;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType;

    @Column(name = "mime_type", length = 200)
    private String mimeType;

    @Column(nullable = false)
    private Long size;

    @Column(name = "secure_url", nullable = false, length = 2000)
    private String secureUrl;

    @Column(length = 500)
    private String folder;

    @Column(name = "owner_id", length = 200)
    private String ownerId;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id", length = 200)
    private String entityId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
