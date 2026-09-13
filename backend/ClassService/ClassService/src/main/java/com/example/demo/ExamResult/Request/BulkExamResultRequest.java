package com.example.demo.ExamResult.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkExamResultRequest {

    @NotNull
    private UUID examId;

    @NotEmpty
    @Valid
    private List<StudentExamMarks> results;
}