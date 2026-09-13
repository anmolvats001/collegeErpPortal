package com.example.demo.Chat.Service;

import com.example.demo.Chat.Entity.Conversation;
import com.example.demo.Chat.Entity.ConversationMember;
import com.example.demo.Chat.Repository.ConversationMemberRepo;
import com.example.demo.Chat.Repository.ConversationRepo;
import com.example.demo.Chat.Request.ConversationMemberRequest;
import com.example.demo.Chat.Response.ConversationMemberResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationMemberService {

    private final ConversationMemberRepo conversationMemberRepo;
    private final ConversationRepo conversationRepo;

    @Transactional
    public ConversationMemberResponse addMember(
            ConversationMemberRequest request
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        Conversation conversation = conversationRepo
                .findByIdAndCollegeId(
                        request.getConversationId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Conversation not found")
                );

        if (conversationMemberRepo
                .existsByConversation_IdAndUserIdAndCollegeId(
                        request.getConversationId(),
                        request.getUserId(),
                        collegeId
                )) {

            throw new RuntimeException("User is already a member");
        }

        ConversationMember member = new ConversationMember();

        member.setConversation(conversation);
        member.setUserId(request.getUserId());
        member.setMemberType(request.getMemberType());
        member.setCollegeId(collegeId);
        member.setIsActive(true);

        ConversationMember saved =
                conversationMemberRepo.save(member);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ConversationMemberResponse> getConversationMembers(
            UUID conversationId
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        return conversationMemberRepo
                .findByConversation_IdAndCollegeId(
                        conversationId,
                        collegeId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConversationMemberResponse getMember(
            UUID memberId
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        ConversationMember member = conversationMemberRepo
                .findById(memberId)
                .filter(m -> collegeId.equals(m.getCollegeId()))
                .orElseThrow(() ->
                        new RuntimeException("Conversation member not found")
                );

        return mapToResponse(member);
    }

    @Transactional(readOnly = true)
    public ConversationMemberResponse getMemberByUser(
            UUID conversationId,
            String userId
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        ConversationMember member = conversationMemberRepo
                .findByConversation_IdAndUserIdAndCollegeId(
                        conversationId,
                        userId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Conversation member not found")
                );

        return mapToResponse(member);
    }

    @Transactional(readOnly = true)
    public List<ConversationMemberResponse> getMyMemberships(
    ) {

        UUID collegeId = CollegeContext.getCollegeId();
        String userId= UserContext.getUserId();
        return conversationMemberRepo
                .findByUserIdAndIsActiveTrueAndCollegeId(
                        userId,
                        collegeId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ConversationMemberResponse updateActiveStatus(
            UUID memberId,
            boolean active
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        ConversationMember member = conversationMemberRepo
                .findById(memberId)
                .filter(m -> collegeId.equals(m.getCollegeId()))
                .orElseThrow(() ->
                        new RuntimeException("Conversation member not found")
                );

        member.setIsActive(active);

        return mapToResponse(
                conversationMemberRepo.save(member)
        );
    }

    @Transactional
    public ConversationMemberResponse removeMember(
            UUID memberId
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        ConversationMember member = conversationMemberRepo
                .findById(memberId)
                .filter(m -> collegeId.equals(m.getCollegeId()))
                .orElseThrow(() ->
                        new RuntimeException("Conversation member not found")
                );

        conversationMemberRepo.delete(member);

        return mapToResponse(member);
    }

    private ConversationMemberResponse mapToResponse(
            ConversationMember member
    ) {

        return ConversationMemberResponse.builder()
                .id(member.getId())
                .conversationId(member.getConversation().getId())
                .userId(member.getUserId())
                .memberType(member.getMemberType())
                .collegeId(member.getCollegeId())
                .isActive(member.getIsActive())
                .build();
    }
}