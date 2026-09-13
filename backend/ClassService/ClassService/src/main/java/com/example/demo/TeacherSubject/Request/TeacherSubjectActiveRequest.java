package com.example.demo.TeacherSubject.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSubjectActiveRequest {

    @NotNull
    private UUID teacherSubjectId;

    @NotNull
    private Boolean active;
}