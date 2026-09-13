package com.example.cloudinary.file;

import com.example.cloudinary.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {
    List<FileMetadata> findByEntityTypeAndEntityId(String entityType, String entityId);
    List<FileMetadata> findByOwnerId(String ownerId);
}
