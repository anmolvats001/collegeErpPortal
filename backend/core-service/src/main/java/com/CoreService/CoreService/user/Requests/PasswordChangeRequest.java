package com.CoreService.CoreService.user.Requests;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class PasswordChangeRequest {
    private String oldPassword;
    private String newPassword;
}
