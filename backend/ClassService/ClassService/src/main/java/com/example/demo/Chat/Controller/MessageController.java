package com.example.demo.Chat.Controller;

import com.example.demo.Chat.Request.MessageRequest;
import com.example.demo.Chat.Response.MessageResponse;
import com.example.demo.Chat.Service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/class/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PreAuthorize("hasAuthority('SEND_MESSAGE')")
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @RequestBody @Valid MessageRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(messageService.sendMessage(request));
    }

    @PreAuthorize("hasAuthority('VIEW_MESSAGE')")
    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable UUID conversationId,
            Pageable pageable) {

        return ResponseEntity.ok(
                messageService.getMessages(
                        conversationId,
                        pageable
                )
        );
    }

    @PreAuthorize("hasAuthority('DELETE_MESSAGE')")
    @DeleteMapping("/{messageId}")
    public ResponseEntity<MessageResponse> deleteMessage(
            @PathVariable UUID messageId) {

        return ResponseEntity.ok(
                messageService.deleteMessage(messageId)
        );
    }
}