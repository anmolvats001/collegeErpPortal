package com.example.demo.Exam.Request;

import com.example.demo.Exam.Entity.ExamStatus;
import com.example.demo.Exam.Entity.ExamType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamRequest {

    @NotBlank
    private String examName;

    @NotNull
    private ExamType examType;

    @NotNull
    private UUID classSubjectId;

    @NotNull
    private UUID teacherSubjectId;

    @NotNull
    private LocalDate examDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotNull
    @Positive
    private Integer maxMarks;

    @NotNull
    @PositiveOrZero
    private Integer passingMarks;

    @NotNull
    private ExamStatus status;
}