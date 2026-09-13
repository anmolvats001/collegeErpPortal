package com.example.admission.core.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CollegePublicResponse {
    private UUID collegeId;
    private String collegeName, collegeCode, universityName, collegeEmail, collegePhone, collegeAddress;
}
