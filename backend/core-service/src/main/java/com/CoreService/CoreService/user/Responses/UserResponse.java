package com.CoreService.CoreService.user.Responses;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserResponse {
    private String userId;

    private String fatherName;
    private String userName;
    private String userCollegeId;

    private UUID collegeId;

    private String image;

    private Long phoneNumber;

    private Long alternatePhoneNumber;

    private String bloodGroup;

    private String email;

    private Boolean active;
}
