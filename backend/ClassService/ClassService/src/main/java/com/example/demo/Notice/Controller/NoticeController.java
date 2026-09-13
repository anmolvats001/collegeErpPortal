package com.example.demo.Notice.Controller;

import com.example.demo.Notice.Request.NoticeRequest;
import com.example.demo.Notice.Response.NoticeResponse;
import com.example.demo.Notice.Service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/class/notice")
public class NoticeController {

    private final NoticeService noticeService;


    // =========================================
    // CREATE NOTICE
    // =========================================

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<NoticeResponse> createNotice(
            @Valid @RequestBody NoticeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        noticeService.createNotice(request)
                );
    }


    // =========================================
    // GET ALL NOTICES
    // =========================================

    @GetMapping
    @PreAuthorize("hasAuthority('GET_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<List<NoticeResponse>>
    getAllNotices() {

        return ResponseEntity.ok(
                noticeService.getAllNotices()
        );
    }


    // =========================================
    // GET ACTIVE NOTICES
    // =========================================

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('GET_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<List<NoticeResponse>>
    getActiveNotices() {

        return ResponseEntity.ok(
                noticeService.getActiveNotices()
        );
    }


    // =========================================
    // GET CURRENT NOTICES
    // =========================================

    @GetMapping("/current")
    @PreAuthorize("hasAuthority('GET_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<List<NoticeResponse>>
    getCurrentNotices() {

        return ResponseEntity.ok(
                noticeService.getCurrentNotices()
        );
    }


    // =========================================
    // GET BY ID
    // =========================================

    @GetMapping("/{noticeId}")
    @PreAuthorize("hasAuthority('GET_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<NoticeResponse> getNotice(
            @PathVariable UUID noticeId) {

        return ResponseEntity.ok(
                noticeService.getNotice(noticeId)
        );
    }


    // =========================================
    // UPDATE
    // =========================================

    @PatchMapping("/{noticeId}")
    @PreAuthorize("hasAuthority('UPDATE_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<NoticeResponse> updateNotice(
            @PathVariable UUID noticeId,
            @Valid @RequestBody NoticeRequest request) {

        return ResponseEntity.ok(
                noticeService.updateNotice(
                        noticeId,
                        request
                )
        );
    }


    // =========================================
    // DEACTIVATE
    // =========================================

    @PatchMapping("/{noticeId}/deactivate")
    @PreAuthorize("hasAuthority('UPDATE_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<Void> deactivateNotice(
            @PathVariable UUID noticeId) {

        noticeService.deactivateNotice(noticeId);

        return ResponseEntity.noContent().build();
    }


    // =========================================
    // DELETE
    // =========================================

    @DeleteMapping("/{noticeId}")
    @PreAuthorize("hasAuthority('DELETE_NOTICE') and hasAuthority('MODULE_NOTICE')")
    public ResponseEntity<Void> deleteNotice(
            @PathVariable UUID noticeId) {

        noticeService.deleteNotice(noticeId);

        return ResponseEntity.noContent().build();
    }
}