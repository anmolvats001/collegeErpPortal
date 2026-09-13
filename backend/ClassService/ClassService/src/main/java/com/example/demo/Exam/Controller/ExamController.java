package com.example.demo.Exam.Controller;

import com.example.demo.Exam.Entity.ExamStatus;
import com.example.demo.Exam.Entity.ExamType;
import com.example.demo.Exam.Request.ExamRequest;
import com.example.demo.Exam.Response.ExamResponse;
import com.example.demo.Exam.Service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/class/exam")
public class ExamController {

    private final ExamService examService;


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResponse> createExam(
            @Valid @RequestBody ExamRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        examService.createExam(request)
                );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    @PreAuthorize("hasAuthority('GET_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResponse>> getAllExams() {

        return ResponseEntity.ok(
                examService.getAllExams()
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{examId}")
    @PreAuthorize("hasAuthority('GET_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResponse> getExam(
            @PathVariable UUID examId) {

        return ResponseEntity.ok(
                examService.getExam(examId)
        );
    }


    // =====================================================
    // GET BY CLASS SUBJECT
    // =====================================================

    @GetMapping("/class-subject/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResponse>>
    getExamsOfClassSubject(
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                examService
                        .getExamsOfClassSubject(
                                classSubjectId
                        )
        );
    }


    // =====================================================
    // GET BY TEACHER SUBJECT
    // =====================================================

    @GetMapping("/teacher-subject/{teacherSubjectId}")
    @PreAuthorize("hasAuthority('GET_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResponse>>
    getExamsOfTeacherSubject(
            @PathVariable UUID teacherSubjectId) {

        return ResponseEntity.ok(
                examService
                        .getExamsOfTeacherSubject(
                                teacherSubjectId
                        )
        );
    }


    // =====================================================
    // GET BY DATE
    // =====================================================

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAuthority('GET_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResponse>>
    getExamsByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                examService
                        .getExamsByDate(date)
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PatchMapping("/{examId}")
    @PreAuthorize("hasAuthority('UPDATE_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResponse> updateExam(
            @PathVariable UUID examId,
            @Valid @RequestBody ExamRequest request) {

        return ResponseEntity.ok(
                examService.updateExam(
                        examId,
                        request
                )
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{examId}")
    @PreAuthorize("hasAuthority('DELETE_EXAM') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<Void> deleteExam(
            @PathVariable UUID examId) {

        examService.deleteExam(examId);

        return ResponseEntity.noContent().build();
    }
}