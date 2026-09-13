package com.example.demo.Chat.Controller;

import com.example.demo.Chat.Request.ConversationMemberRequest;
import com.example.demo.Chat.Response.ConversationMemberResponse;
import com.example.demo.Chat.Service.ConversationMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/class/conversation-members")
@RequiredArgsConstructor
public class ConversationMemberController {

    private final ConversationMemberService conversationMemberService;

    @PreAuthorize("hasAuthority('CREATE_CONVERSATION_MEMBER')")
    @PostMapping
    public ResponseEntity<ConversationMemberResponse> addMember(
            @RequestBody @Valid ConversationMemberRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(conversationMemberService.addMember(request));
    }

    @PreAuthorize("hasAuthority('VIEW_CONVERSATION_MEMBER')")
    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<ConversationMemberResponse>> getConversationMembers(
            @PathVariable UUID conversationId) {

        return ResponseEntity.ok(
                conversationMemberService.getConversationMembers(conversationId)
        );
    }

    @PreAuthorize("hasAuthority('VIEW_CONVERSATION_MEMBER')")
    @GetMapping("/{memberId}")
    public ResponseEntity<ConversationMemberResponse> getMember(
            @PathVariable UUID memberId) {

        return ResponseEntity.ok(
                conversationMemberService.getMember(memberId)
        );
    }

    @PreAuthorize("hasAuthority('VIEW_CONVERSATION_MEMBER')")
    @GetMapping("/conversation/{conversationId}/user/{userId}")
    public ResponseEntity<ConversationMemberResponse> getMemberByUser(
            @PathVariable UUID conversationId,
            @PathVariable String userId) {

        return ResponseEntity.ok(
                conversationMemberService.getMemberByUser(
                        conversationId,
                        userId
                )
        );
    }

    @PreAuthorize("hasAuthority('VIEW_CONVERSATION_MEMBER')")
    @GetMapping("/my")
    public ResponseEntity<List<ConversationMemberResponse>> getMyMemberships() {

        return ResponseEntity.ok(
                conversationMemberService.getMyMemberships()
        );
    }

    @PreAuthorize("hasAuthority('UPDATE_CONVERSATION_MEMBER')")
    @PatchMapping("/{memberId}/active")
    public ResponseEntity<ConversationMemberResponse> updateActiveStatus(
            @PathVariable UUID memberId,
            @RequestParam boolean active) {

        return ResponseEntity.ok(
                conversationMemberService.updateActiveStatus(
                        memberId,
                        active
                )
        );
    }

    @PreAuthorize("hasAuthority('DELETE_CONVERSATION_MEMBER')")
    @DeleteMapping("/{memberId}")
    public ResponseEntity<ConversationMemberResponse> removeMember(
            @PathVariable UUID memberId) {

        return ResponseEntity.ok(
                conversationMemberService.removeMember(memberId)
        );
    }
}