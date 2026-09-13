package com.example.demo.Chat.Service;

import com.example.demo.Chat.Entity.*;
import com.example.demo.Chat.Repository.ChatSettingRepo;
import com.example.demo.Chat.Repository.ConversationMemberRepo;
import com.example.demo.Chat.Repository.ConversationRepo;
import com.example.demo.Chat.Repository.MessageRepo;
import com.example.demo.Chat.Request.MessageRequest;
import com.example.demo.Chat.Response.MessageResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepo messageRepo;
    private final ConversationRepo conversationRepo;
    private final ConversationMemberRepo conversationMemberRepo;
    private final ChatSettingRepo chatSettingRepo;

    @Transactional
    public MessageResponse sendMessage(MessageRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();
        String userId = UserContext.getUserId();

        Conversation conversation = conversationRepo
                .findByIdAndCollegeId(
                        request.getConversationId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Conversation not found")
                );

        ConversationMember member = conversationMemberRepo
                .findByConversation_IdAndUserIdAndCollegeId(
                        request.getConversationId(),
                        userId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("User is not a member of this conversation")
                );

        if (!Boolean.TRUE.equals(member.getIsActive())) {
            throw new RuntimeException("User is not an active member");
        }

        ChatSetting chatSetting = chatSettingRepo
                .findByConversation_IdAndCollegeId(
                        request.getConversationId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Chat setting not found")
                );

        if (chatSetting.getSendPermission()
                == ChatSetting.SendPermission.TEACHER_ONLY
                && member.getMemberType() != MemberType.TEACHER) {

            throw new RuntimeException(
                    "Only teachers can send messages"
            );
        }

        Message message = Message.builder()
                .conversation(conversation)
                .conversationMember(member)
                .messageType(request.getMessageType())
                .message(request.getMessage())
                .collegeId(collegeId)
                .isActive(true)
                .isDeleted(false)
                .build();

        Message savedMessage = messageRepo.save(message);

        return mapToResponse(savedMessage);
    }

    @Transactional(readOnly = true)
    public Page<MessageResponse> getMessages(
            UUID conversationId,
            Pageable pageable
    ) {

        UUID collegeId = CollegeContext.getCollegeId();

        conversationRepo
                .findByIdAndCollegeId(
                        conversationId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Conversation not found")
                );

        return messageRepo
                .findByConversation_IdAndCollegeId(
                        conversationId,
                        collegeId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Transactional
    public MessageResponse deleteMessage(UUID messageId) {

        UUID collegeId = CollegeContext.getCollegeId();
        String userId = UserContext.getUserId();

        Message message = messageRepo
                .findById(messageId)
                .filter(m -> collegeId.equals(m.getCollegeId()))
                .orElseThrow(() ->
                        new RuntimeException("Message not found")
                );

        if (!message.getConversationMember()
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You can only delete your own message"
            );
        }

        message.setIsDeleted(true);
        message.setIsActive(false);

        return mapToResponse(
                messageRepo.save(message)
        );
    }

    private MessageResponse mapToResponse(Message message) {

        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(
                        message.getConversation().getId()
                )
                .conversationMemberId(
                        message.getConversationMember().getId()
                )
                .userId(
                        message.getConversationMember().getUserId()
                )
                .messageType(message.getMessageType())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .collegeId(message.getCollegeId())
                .build();
    }
}