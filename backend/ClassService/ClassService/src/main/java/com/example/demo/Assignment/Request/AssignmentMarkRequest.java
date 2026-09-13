package com.example.demo.Assignment.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentMarkRequest {

    @NotNull
    private UUID assignmentId;

    @NotNull
    private UUID studentClassId;

    @NotNull
    private Integer marks;
}