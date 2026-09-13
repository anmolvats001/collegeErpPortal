package com.CoreService.CoreService.user.Requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequsets {
    @NotBlank
    private String userId;

    private String password;

    @Email
    private String email;
    private String userName;
}
