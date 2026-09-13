package com.example.demo.Teacher.Response;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherResponse {

    private UUID teacherId;

    private String userId;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String designation;

    private String department;

    private LocalDate joiningDate;

    private String qualification;

    private Boolean active;
}