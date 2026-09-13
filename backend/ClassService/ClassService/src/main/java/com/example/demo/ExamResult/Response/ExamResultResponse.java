package com.example.demo.ExamResult.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {

    private UUID resultId;

    private UUID examId;

    private UUID studentClassId;

    private Integer marks;

    private Integer maxMarks;

    private Boolean passed;
}