package com.example.demo.TeacherSubject.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSubjectRequest {

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;

    @NotNull(message = "Class subject ID is required")
    private UUID classSubjectId;
}