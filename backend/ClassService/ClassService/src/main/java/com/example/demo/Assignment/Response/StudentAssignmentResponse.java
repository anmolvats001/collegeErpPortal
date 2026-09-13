package com.example.demo.Assignment.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAssignmentResponse {

    private UUID studentAssignmentId;

    private UUID assignmentId;

    private UUID studentClassId;

    private Integer marks;

    private Integer maxMarks;
}