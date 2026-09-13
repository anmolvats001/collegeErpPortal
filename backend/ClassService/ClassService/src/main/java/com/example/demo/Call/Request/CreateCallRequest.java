package com.example.demo.Call.Request;

import com.example.demo.Call.Entity.CallType;
import lombok.Data;

@Data
public class CreateCallRequest {

    private CallType callType;
}