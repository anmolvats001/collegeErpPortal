package com.example.admission.admission.controller;

import com.example.admission.admission.entity.AdmissionStatus;
import com.example.admission.admission.request.*;
import com.example.admission.admission.response.*;
import com.example.admission.admission.service.AdmissionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admission")
public class AdmissionController {
    private final AdmissionService service;

    public AdmissionController(AdmissionService service) {
        this.service = service;
    }

    @PostMapping("/public/code/{collegeCode}/apply")
    public ResponseEntity<AdmissionApplicationResponse> applyByCode(@PathVariable String collegeCode, @RequestBody @Valid AdmissionApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.applyByCode(collegeCode, request));
    }

    @PostMapping("/public/id/{collegeId}/apply")
    public ResponseEntity<AdmissionApplicationResponse> applyById(@PathVariable UUID collegeId, @RequestBody @Valid AdmissionApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.applyById(collegeId, request));
    }

    @GetMapping("/public/track/{ref}")
    public ResponseEntity<AdmissionApplicationResponse> track(@PathVariable String ref) {
        return ResponseEntity.ok(service.track(ref));
    }

    @GetMapping("/public/track/{ref}/documents")
    public ResponseEntity<List<DocumentResponse>> trackDocuments(@PathVariable String ref) {
        return ResponseEntity.ok(service.trackDocuments(ref));
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('VIEW_ADMISSION')")
    @GetMapping("/applications")
    public Page<AdmissionApplicationResponse> list(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) AdmissionStatus status) {
        return service.list(page, size, status);
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('VIEW_ADMISSION')")
    @GetMapping("/applications/{id}")
    public AdmissionApplicationResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('VIEW_ADMISSION')")
    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return service.dashboard();
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('UPDATE_ADMISSION')")
    @PatchMapping("/applications/{id}/review")
    public AdmissionApplicationResponse review(@PathVariable UUID id) {
        return service.review(id);
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('APPROVE_ADMISSION')")
    @PatchMapping("/applications/{id}/approve")
    public AdmissionApplicationResponse approve(@PathVariable UUID id) {
        return service.approve(id);
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('REJECT_ADMISSION')")
    @PatchMapping("/applications/{id}/reject")
    public AdmissionApplicationResponse reject(@PathVariable UUID id, @RequestBody @Valid RejectAdmissionRequest request) {
        return service.reject(id, request);
    }

    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'MAIN_ADMIN') and hasAuthority('MODULE_ADMISSION') and hasAuthority('VIEW_ADMISSION')")
    @GetMapping("/applications/{id}/documents")
    public List<DocumentResponse> documents(@PathVariable UUID id) {
        return service.documents(id);
    }
}
