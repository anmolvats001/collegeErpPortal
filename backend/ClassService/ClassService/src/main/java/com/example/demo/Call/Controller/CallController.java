package com.example.demo.Call.Controller;

import com.example.demo.Call.Request.CreateCallRequest;
import com.example.demo.Call.Response.CallResponse;
import com.example.demo.Call.Service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/class/calls")
@RequiredArgsConstructor
public class CallController {

    private final CallService callService;


    @PreAuthorize("hasAuthority('CREATE_CALL')")
    @PostMapping
    public ResponseEntity<CallResponse> createCall(
            @RequestBody CreateCallRequest request
    ) {

        return ResponseEntity.ok(
                callService.createCall(request)
        );
    }


    @PreAuthorize("hasAuthority('VIEW_CALL')")
    @GetMapping("/join/{joinCode}")
    public ResponseEntity<CallResponse> joinCall(
            @PathVariable String joinCode
    ) {

        return ResponseEntity.ok(
                callService.joinCall(joinCode)
        );
    }


    @PreAuthorize("hasAuthority('VIEW_CALL')")
    @GetMapping("/{callId}")
    public ResponseEntity<CallResponse> getCall(
            @PathVariable UUID callId
    ) {

        return ResponseEntity.ok(
                callService.getCall(callId)
        );
    }


    @PreAuthorize("hasAuthority('END_CALL')")
    @PostMapping("/{callId}/end")
    public ResponseEntity<CallResponse> endCall(
            @PathVariable UUID callId
    ) {

        return ResponseEntity.ok(
                callService.endCall(callId)
        );
    }
}