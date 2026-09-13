package com.CoreService.CoreService.user.Entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserEntity {
    @Id
    @Column(unique = true, nullable = false)
    private String userId;
    @NonNull
    private String userName;
    private String fatherName;
    @Nullable
    private UUID collegeId;
    private String image;
    private Long phoneNumber;
    private Long alternatePhoneNumber;
    private String bloodGroup;
    @NonNull
    private String email;
    @NonNull
    private String password;
    private Boolean activate;
}