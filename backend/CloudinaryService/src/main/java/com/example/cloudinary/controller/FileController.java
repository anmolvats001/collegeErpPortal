package com.example.cloudinary.controller;

import com.example.cloudinary.dto.FileResponse;
import com.example.cloudinary.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String folder,
            @RequestParam(defaultValue = "auto") String resourceType,
            @RequestParam(required = false) String ownerId,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String entityId) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                fileService.upload(file, folder, resourceType, ownerId, entityType, entityId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(fileService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> list(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String ownerId) {

        if (entityType != null && !entityType.isBlank()
                && entityId != null && !entityId.isBlank()) {
            return ResponseEntity.ok(fileService.findByEntity(entityType, entityId));
        }

        if (ownerId != null && !ownerId.isBlank()) {
            return ResponseEntity.ok(fileService.findByOwner(ownerId));
        }

        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        fileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Cloudinary Service is running");
    }
}
