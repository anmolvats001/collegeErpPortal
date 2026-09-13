package com.example.cloudinary.file;

import com.example.cloudinary.dto.FileResponse;
import com.example.cloudinary.dto.FileUploadedEvent;
import com.example.cloudinary.entity.FileMetadata;
import com.example.cloudinary.exception.FileNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private static final String FILE_EVENTS_TOPIC = "file-events";

    private final CloudinaryStorageService storageService;
    private final FileMetadataRepository repository;
    private final KafkaTemplate<String, FileUploadedEvent> kafkaTemplate;

    public FileResponse upload(
            MultipartFile file,
            String folder,
            String resourceType,
            String ownerId,
            String entityType,
            String entityId) {

        validateFile(file);

        String resolvedFolder = normalizeFolder(folder);
        String resolvedResourceType = normalizeResourceType(resourceType);

        try {
            Map<String, Object> result = storageService.upload(
                    file,
                    resolvedFolder,
                    resolvedResourceType
            );

            String publicId = String.valueOf(result.get("public_id"));
            String secureUrl = String.valueOf(result.get("secure_url"));
            String actualResourceType = result.get("resource_type") == null
                    ? resolvedResourceType
                    : String.valueOf(result.get("resource_type"));

            FileMetadata metadata = FileMetadata.builder()
                    .publicId(publicId)
                    .originalFileName(file.getOriginalFilename() == null
                            ? "file"
                            : file.getOriginalFilename())
                    .resourceType(actualResourceType)
                    .mimeType(file.getContentType())
                    .size(file.getSize())
                    .secureUrl(secureUrl)
                    .folder(resolvedFolder)
                    .ownerId(ownerId)
                    .entityType(entityType)
                    .entityId(entityId)
                    .build();

            FileMetadata saved = repository.save(metadata);

            FileUploadedEvent event = FileUploadedEvent.builder()
                    .eventType("FILE_UPLOADED")
                    .fileId(saved.getId())
                    .publicId(saved.getPublicId())
                    .secureUrl(saved.getSecureUrl())
                    .originalFileName(saved.getOriginalFileName())
                    .mimeType(saved.getMimeType())
                    .size(saved.getSize())
                    .resourceType(saved.getResourceType())
                    .ownerId(saved.getOwnerId())
                    .entityType(saved.getEntityType())
                    .entityId(saved.getEntityId())
                    .uploadedAt(saved.getCreatedAt())
                    .build();

            publishUploadEvent(saved.getId(), event);
            return toResponse(saved);

        } catch (IOException e) {
            throw new IllegalStateException("Cloudinary upload failed", e);
        }
    }

    public FileResponse get(UUID id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + id)));
    }

    public List<FileResponse> findByEntity(String entityType, String entityId) {
        return repository.findByEntityTypeAndEntityId(entityType, entityId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<FileResponse> findByOwner(String ownerId) {
        return repository.findByOwnerId(ownerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void delete(UUID id) {
        FileMetadata metadata = repository.findById(id)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + id));

        try {
            storageService.delete(metadata.getPublicId(), metadata.getResourceType());
            repository.delete(metadata);
        } catch (IOException e) {
            throw new IllegalStateException("Cloudinary delete failed", e);
        }
    }

    private void publishUploadEvent(UUID fileId, FileUploadedEvent event) {
        try {
            kafkaTemplate.send(FILE_EVENTS_TOPIC, fileId.toString(), event)
                    .whenComplete((result, error) -> {
                        if (error != null) {
                            log.error("Failed to publish FILE_UPLOADED event for {}", fileId, error);
                        }
                    });
        } catch (RuntimeException e) {
            log.error("Unable to publish FILE_UPLOADED event for {}", fileId, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
    }

    private String normalizeFolder(String folder) {
        if (folder == null || folder.isBlank()) {
            return "multi-college/general";
        }

        String normalized = folder.trim()
                .replace('\\', '/')
                .replaceAll("/+", "/");

        while (normalized.startsWith("/")) {
            normalized = normalized.substring(1);
        }
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }

        return normalized.isBlank() ? "multi-college/general" : normalized;
    }

    private String normalizeResourceType(String resourceType) {
        if (resourceType == null || resourceType.isBlank()) {
            return "auto";
        }

        String value = resourceType.trim().toLowerCase();
        if (!List.of("auto", "image", "video", "raw").contains(value)) {
            throw new IllegalArgumentException(
                    "resourceType must be one of: auto, image, video, raw"
            );
        }
        return value;
    }

    private FileResponse toResponse(FileMetadata metadata) {
        return FileResponse.builder()
                .fileId(metadata.getId())
                .publicId(metadata.getPublicId())
                .originalFileName(metadata.getOriginalFileName())
                .resourceType(metadata.getResourceType())
                .mimeType(metadata.getMimeType())
                .size(metadata.getSize())
                .secureUrl(metadata.getSecureUrl())
                .folder(metadata.getFolder())
                .ownerId(metadata.getOwnerId())
                .entityType(metadata.getEntityType())
                .entityId(metadata.getEntityId())
                .createdAt(metadata.getCreatedAt())
                .build();
    }
}
