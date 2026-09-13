package com.CoreService.CoreService.auth.Requests;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    private String userId;

    private String newPassword;
}