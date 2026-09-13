package com.example.demo.Teacher.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherActiveRequest {

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;

    @NotNull(message = "Active status is required")
    private Boolean active;
}