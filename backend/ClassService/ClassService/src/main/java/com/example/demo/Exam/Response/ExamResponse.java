package com.example.demo.Exam.Response;

import com.example.demo.Exam.Entity.ExamStatus;
import com.example.demo.Exam.Entity.ExamType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponse {

    private UUID examId;

    private String examName;

    private ExamType examType;

    private UUID classSubjectId;

    private UUID teacherSubjectId;

    private LocalDate examDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer maxMarks;

    private Integer passingMarks;

    private ExamStatus status;
}