package com.example.demo.Chat.Service;

import com.example.demo.Chat.Entity.Conversation;
import com.example.demo.Chat.Repository.ConversationRepo;
import com.example.demo.Chat.Request.ActiveRequest;
import com.example.demo.Chat.Request.ConversationRequest;
import com.example.demo.Chat.Response.ConversationResponse;
import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Class.Repository.ClassRepo;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private ConversationRepo conversationRepo;
    private ClassRepo classRepo;
    public ConversationResponse createConversation(ConversationRequest conversationRequest) {
        UUID collegeId= CollegeContext.getCollegeId();
        ClassEntity classEntity=classRepo.findById(conversationRequest.getClassId()).orElseThrow(()->new RuntimeException("Class not found"));
        if(!classEntity.getCollegeId().equals(collegeId)){
            throw new RuntimeException("Class is not the college");
        }
        if(conversationRepo.existsByClassEntity_Id(conversationRequest.getClassId())) {
            throw new RuntimeException("Class Chat already exists");
        }
        Conversation conversation=Conversation.builder()
                .collegeId(collegeId)
                .classEntity(classEntity)
                .createdBy(UserContext.getUserId())
                .updatedBy(UserContext.getUserId())
                .build();
        return createConversationResponse(conversation);
    }
    public ConversationResponse getConversation(UUID conversationId) {
        Conversation conversation=conversationRepo.findByIdAndCollegeId(conversationId,CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Conversation not found"));
        return createConversationResponse(conversation);
    }
    public List<ConversationResponse> getAllConversationsOfBranch(UUID branchId) {
        List<Conversation> conversations=conversationRepo.findByClassEntity_Branch_IdAndCollegeId(branchId,CollegeContext.getCollegeId());
        List<ConversationResponse> conversationResponses=new ArrayList<>();
        for(Conversation conversation:conversations){
            conversationResponses.add(createConversationResponse(conversation));
        }
        return conversationResponses;
    }
    public ConversationResponse getConversationByClassId(UUID classId) {
        Conversation conversation=conversationRepo.findByClassEntity_IdAndCollegeId(classId,CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Conversation not found"));
        return createConversationResponse(conversation);
    }
    public List<ConversationResponse> getAllConversationOfCollege(){
        List<Conversation> conversations=conversationRepo.findByCollegeId(CollegeContext.getCollegeId());
        List<ConversationResponse> conversationResponses=new ArrayList<>();
        for(Conversation conversation:conversations){
            conversationResponses.add(createConversationResponse(conversation));
        }
        return conversationResponses;
    }
    public ConversationResponse updateConversationActive( ActiveRequest activeRequest) {
        Conversation conversation=conversationRepo.findByIdAndCollegeId(activeRequest.getId(),CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Conversation not found"));
        conversation.setIsActive(activeRequest.isActive());
        Conversation conversation1= conversationRepo.save(conversation);
        return createConversationResponse(conversation1);
    }
    public ConversationResponse deleteConversation(UUID conversationId) {
        Conversation conversation= conversationRepo.findByIdAndCollegeId(conversationId,CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Conversation not found"));
        conversation.setIsDeleted(true);
        conversation.setIsActive(false);
        Conversation conversation1= conversationRepo.save(conversation);
        return createConversationResponse(conversation1);
    }
    private ConversationResponse createConversationResponse(Conversation conversation) {
        return ConversationResponse.builder()
                .id(conversation.getId())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .classId(conversation.getClassEntity().getId())
                .isActive(conversation.getIsActive())
                .isDeleted(conversation.getIsDeleted())
                .build();
    }
}
