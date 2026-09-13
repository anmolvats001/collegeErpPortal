package com.example.demo.Teacher.Request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

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

    private String designation;

    private String department;

    private LocalDate joiningDate;

    private String qualification;
}