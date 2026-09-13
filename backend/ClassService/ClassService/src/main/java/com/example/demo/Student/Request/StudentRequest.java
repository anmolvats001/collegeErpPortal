package com.example.demo.Student.Request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Enrollment number is required")
    private String enrollmentNumber;

    private String rollNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @Email(message = "Invalid email")
    private String email;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain 10 digits"
    )
    private String phoneNumber;

    private String profilePhoto;

    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;

    private String guardianName;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Guardian phone number must contain 10 digits"
    )
    private String guardianPhoneNumber;

    private String address;

    private LocalDate admissionDate;
}