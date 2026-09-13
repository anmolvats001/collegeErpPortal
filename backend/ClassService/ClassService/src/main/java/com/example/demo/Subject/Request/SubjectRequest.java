package com.example.demo.Subject.Request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    private String description;

    @NotNull(message = "Credits are required")
    @Min(value = 1, message = "Credits must be at least 1")
    private Integer credits;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    private Integer semester;

    @NotNull(message = "Course ID is required")
    private UUID courseId;
}