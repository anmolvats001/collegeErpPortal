package com.example.demo.Chat.Controller;

import com.example.demo.Chat.Request.ActiveRequest;
import com.example.demo.Chat.Request.ConversationRequest;
import com.example.demo.Chat.Response.ConversationResponse;
import com.example.demo.Chat.Service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/class/conversation")
public class ConversationController {
    private final ConversationService conversationService;
    @PreAuthorize("hasAuthority('CREATE_CONVERSATION')")
    @PostMapping()
    public ResponseEntity<ConversationResponse> createConversation(@RequestBody @Valid ConversationRequest conversationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(conversationService.createConversation(conversationRequest));
    }
    @PreAuthorize("hasAuthority('VIEW_CONVERSATION')")
    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(@PathVariable("conversationId") UUID conversationId) {
        return  ResponseEntity.ok(conversationService.getConversation(conversationId));
    }
    @PreAuthorize("hasAuthority('VIEW_CONVERSATION')")
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<ConversationResponse>> getAllConversations(@PathVariable UUID branchId) {
        return ResponseEntity.ok(conversationService.getAllConversationsOfBranch(branchId));
    }
    @PreAuthorize("hasAuthority('VIEW_CONVERSATION')")
    @GetMapping("/class/{classId}")
    public ResponseEntity<ConversationResponse> getAllConversationsOfClass(@PathVariable UUID classId) {
        return ResponseEntity.ok(conversationService.getConversationByClassId(classId));
    }
    @PreAuthorize("hasAuthority('VIEW_CONVERSATION')")
    @GetMapping("/college")
    public ResponseEntity<List<ConversationResponse>> getAllConversationsOfCollege() {
        return ResponseEntity.ok(conversationService.getAllConversationOfCollege());
    }
    @PreAuthorize("hasAuthority('UPDATE_CONVERSATION')")
    @PatchMapping("/active")
    public ResponseEntity<ConversationResponse> updateActiveStatus(@RequestBody @Valid ActiveRequest activeRequest) {
        return ResponseEntity.ok(conversationService.updateConversationActive(activeRequest));
    }
    @PreAuthorize("hasAuthority('DELETE_CONVERSATION')")
    @DeleteMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> deleteConversation(@PathVariable("conversationId") UUID conversationId) {
        return ResponseEntity.ok(conversationService.deleteConversation(conversationId));
    }
}
