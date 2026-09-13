package com.example.demo.Assignment.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {

    private UUID assignmentId;

    private String assignmentName;

    private String description;

    private Integer maxMarks;

    private UUID classSubjectId;

    private UUID teacherSubjectId;
}