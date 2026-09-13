package com.example.demo.ClassSubject.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSubjectActiveRequest {

    @NotNull
    private UUID classSubjectId;

    @NotNull
    private Boolean active;
}