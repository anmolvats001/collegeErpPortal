package com.example.demo.ExamResult.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultRequest {

    @NotNull
    private UUID examId;

    @NotNull
    private UUID studentClassId;

    @NotNull
    @Min(0)
    private Integer marks;
}