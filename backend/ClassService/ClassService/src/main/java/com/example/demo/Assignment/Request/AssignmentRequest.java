package com.example.demo.Assignment.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {

    @NotBlank
    private String assignmentName;

    private String description;

    @NotNull
    @Positive
    private Integer maxMarks;

    @NotNull
    private UUID classSubjectId;

    @NotNull
    private UUID teacherSubjectId;
}