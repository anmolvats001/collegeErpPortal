package com.example.admission.admission.response;

import com.example.admission.admission.entity.AdmissionStatus;
import lombok.*;

import java.time.*;
import java.util.UUID;

@Getter
@Builder
public class AdmissionApplicationResponse {
    private UUID id;
    private String applicationNumber, collegeCode, applicantName, email, phoneNumber, gender, address, fatherName, motherName, courseName, branchName, previousQualification, previousInstitution, reviewedBy, rejectionReason;
    private UUID collegeId, courseId, branchId;
    private LocalDate dateOfBirth;
    private Double previousPercentage;
    private AdmissionStatus status;
    private LocalDateTime submittedAt, reviewedAt;
}
