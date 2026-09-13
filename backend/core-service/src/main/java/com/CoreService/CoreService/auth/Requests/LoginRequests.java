package com.CoreService.CoreService.auth.Requests;


import jakarta.persistence.Entity;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequests {
    private String userId;
    private String password;
}
