package com.example.demo.Call.Service;

import com.example.demo.Call.Entity.*;
import com.example.demo.Call.Repository.CallRepo;
import com.example.demo.Call.Request.CreateCallRequest;
import com.example.demo.Call.Response.CallResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CallService {

    private final CallRepo callRepo;


    // ==========================================
    // CREATE CALL
    // ==========================================

    @Transactional
    public CallResponse createCall(
            CreateCallRequest request
    ) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        String userId =
                UserContext.getUserId();


        if (collegeId == null) {
            throw new RuntimeException(
                    "College context not found"
            );
        }

        if (userId == null) {
            throw new RuntimeException(
                    "User context not found"
            );
        }


        String joinCode =
                generateUniqueJoinCode();


        Call call = Call.builder()
                .createdBy(userId)
                .joinCode(joinCode)
                .callType(request.getCallType())
                .status(CallStatus.ACTIVE)
                .startedAt(LocalDateTime.now())
                .build();


        call.setCollegeId(collegeId);
        call.setIsActive(true);
        call.setIsDeleted(false);


        Call savedCall =
                callRepo.save(call);


        return mapToResponse(savedCall);
    }


    // ==========================================
    // JOIN CALL
    // ==========================================

    @Transactional(readOnly = true)
    public CallResponse joinCall(
            String joinCode
    ) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        String userId =
                UserContext.getUserId();


        if (collegeId == null) {
            throw new RuntimeException(
                    "College context not found"
            );
        }

        if (userId == null) {
            throw new RuntimeException(
                    "User context not found"
            );
        }


        /*
         * IMPORTANT:
         *
         * Searching by BOTH joinCode and
         * collegeId ensures that a user cannot
         * join another college's call.
         */

        Call call =
                callRepo
                        .findByJoinCodeAndCollegeId(
                                joinCode,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Call not found"
                                )
                        );


        if (call.getStatus()
                == CallStatus.ENDED) {

            throw new RuntimeException(
                    "This call has ended"
            );
        }


        return mapToResponse(call);
    }


    // ==========================================
    // END CALL
    // ==========================================

    @Transactional
    public CallResponse endCall(
            UUID callId
    ) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        String userId =
                UserContext.getUserId();


        Call call =
                callRepo
                        .findByIdAndCollegeId(
                                callId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Call not found"
                                )
                        );


        /*
         * Only the person who created
         * the call can end it.
         */

        if (!call.getCreatedBy()
                .equals(userId)) {

            throw new RuntimeException(
                    "Only the call creator can end the call"
            );
        }


        call.setStatus(
                CallStatus.ENDED
        );

        call.setIsActive(false);

        call.setEndedAt(
                LocalDateTime.now()
        );


        return mapToResponse(
                callRepo.save(call)
        );
    }


    // ==========================================
    // GET CALL
    // ==========================================

    @Transactional(readOnly = true)
    public CallResponse getCall(
            UUID callId
    ) {

        UUID collegeId =
                CollegeContext.getCollegeId();


        Call call =
                callRepo
                        .findByIdAndCollegeId(
                                callId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Call not found"
                                )
                        );


        return mapToResponse(call);
    }


    // ==========================================
    // GENERATE UNIQUE CODE
    // ==========================================

    private String generateUniqueJoinCode() {

        String code;

        do {

            code = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 12);

        } while (
                callRepo.existsByJoinCode(code)
        );


        return code;
    }


    // ==========================================
    // MAPPER
    // ==========================================

    private CallResponse mapToResponse(
            Call call
    ) {

        String meetingLink =
                "https://meet.jit.si/"
                        + call.getJoinCode();


        return CallResponse.builder()
                .callId(call.getId())
                .createdBy(call.getCreatedBy())
                .callType(call.getCallType())
                .status(call.getStatus())
                .joinCode(call.getJoinCode())
                .meetingLink(meetingLink)
                .startedAt(call.getStartedAt())
                .endedAt(call.getEndedAt())
                .build();
    }
}