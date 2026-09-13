package com.example.demo.StudentClass.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassActiveRequest {

    @NotNull(message = "Student class ID is required")
    private UUID studentClassId;

    @NotNull(message = "Active status is required")
    private Boolean active;
}