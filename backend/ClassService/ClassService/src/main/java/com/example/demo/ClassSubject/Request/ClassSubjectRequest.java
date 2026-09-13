package com.example.demo.ClassSubject.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSubjectRequest {

    @NotNull(message = "Class ID is required")
    private UUID classId;

    @NotNull(message = "Subject ID is required")
    private UUID subjectId;
}