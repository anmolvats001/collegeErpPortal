package com.CoreService.CoreService.auth.Requests;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}
