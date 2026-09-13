package com.example.demo.Student.Response;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {

    private UUID studentId;

    private String userId;

    private String enrollmentNumber;

    private String rollNumber;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String profilePhoto;

    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;

    private String guardianName;

    private String guardianPhoneNumber;

    private String address;

    private LocalDate admissionDate;

    private Boolean active;
}