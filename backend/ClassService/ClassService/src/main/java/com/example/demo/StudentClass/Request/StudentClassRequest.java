package com.example.demo.StudentClass.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassRequest {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Class ID is required")
    private UUID classId;

    @NotNull(message = "Academic year is required")
    private Integer academicYear;

    @NotNull(message = "Semester is required")
    private Integer semester;

    private String rollNumber;
}