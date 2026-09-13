package com.CoreService.CoreService.auth.Response;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    String refreshToken;
    String jwtToken;
    String message;
    public LoginResponse(String message){
        this.message = message;
    }
}
