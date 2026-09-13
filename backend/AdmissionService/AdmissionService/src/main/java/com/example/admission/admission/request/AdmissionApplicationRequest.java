package com.example.admission.admission.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class AdmissionApplicationRequest {
    @NotBlank
    @Size(max = 120)
    private String applicantName;
    @NotBlank
    @Email
    @Size(max = 160)
    private String email;
    @NotBlank
    @Size(max = 30)
    private String phoneNumber;
    private LocalDate dateOfBirth;
    @Size(max = 30)
    private String gender;
    @Size(max = 500)
    private String address;
    @Size(max = 120)
    private String fatherName;
    @Size(max = 120)
    private String motherName;
    private UUID courseId;
    @Size(max = 150)
    private String courseName;
    private UUID branchId;
    @Size(max = 150)
    private String branchName;
    @Size(max = 120)
    private String previousQualification;
    @Size(max = 200)
    private String previousInstitution;
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double previousPercentage;
}
