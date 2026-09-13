package com.example.demo.Student.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentActiveRequest {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Active status is required")
    private Boolean active;
}