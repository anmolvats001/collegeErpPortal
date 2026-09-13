package com.example.demo.Subject.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectActiveRequest {

    @NotNull(message = "Subject ID is required")
    private UUID subjectId;

    @NotNull(message = "Active status is required")
    private Boolean active;
}