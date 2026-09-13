package com.example.admission.admission.controller;

import com.example.admission.admission.request.DocumentRequest;
import com.example.admission.admission.response.DocumentResponse;
import com.example.admission.admission.service.AdmissionService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admission")
public class AdmissionDocumentController {
    private final AdmissionService service;

    public AdmissionDocumentController(AdmissionService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('COLLEGE_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('UPLOAD_ADMISSION_DOCUMENT')")
    @PostMapping("/applications/{id}/documents")
    public ResponseEntity<DocumentResponse> add(@PathVariable UUID id, @RequestBody @Valid DocumentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addDocument(id, request));
    }

    @PreAuthorize("hasRole('COLLEGE_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('VERIFY_ADMISSION_DOCUMENT')")
    @PatchMapping("/documents/{id}/verify")
    public ResponseEntity<DocumentResponse> verify(@PathVariable UUID id, @RequestParam(defaultValue = "true") boolean verified) {
        return ResponseEntity.ok(service.verifyDocument(id, verified));
    }
}
