package com.example.admission.admission.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "admission_applications", indexes = {@Index(name = "idx_admission_college", columnList = "collegeId"), @Index(name = "idx_admission_status", columnList = "status")})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true, length = 40)
    private String applicationNumber;
    @Column(nullable = false)
    private UUID collegeId;
    @Column(nullable = false, length = 80)
    private String collegeCode;
    @Column(nullable = false, length = 120)
    private String applicantName;
    @Column(nullable = false, length = 160)
    private String email;
    @Column(nullable = false, length = 30)
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    @Column(length = 500)
    private String address;
    private String fatherName;
    private String motherName;
    private UUID courseId;
    private String courseName;
    private UUID branchId;
    private String branchName;
    private String previousQualification;
    private String previousInstitution;
    private Double previousPercentage;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AdmissionStatus status;
    @Column(nullable = false)
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    @Column(length = 1000)
    private String rejectionReason;
}
