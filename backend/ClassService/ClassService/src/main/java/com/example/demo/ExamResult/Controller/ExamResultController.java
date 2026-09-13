package com.example.demo.ExamResult.Controller;

import com.example.demo.ExamResult.Request.BulkExamResultRequest;
import com.example.demo.ExamResult.Request.ExamResultRequest;
import com.example.demo.ExamResult.Response.ExamResultResponse;
import com.example.demo.ExamResult.Service.ExamResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/class/exam-result")
public class ExamResultController {

    private final ExamResultService examResultService;


    // =====================================================
    // CREATE RESULT
    // =====================================================

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResultResponse> createResult(
            @Valid @RequestBody ExamResultRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        examResultService
                                .createResult(request)
                );
    }


    // =====================================================
    // BULK CREATE
    // =====================================================

    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('CREATE_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResultResponse>>
    createBulkResults(
            @Valid
            @RequestBody
            BulkExamResultRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        examResultService
                                .createBulkResults(request)
                );
    }


    // =====================================================
    // GET RESULT BY ID
    // =====================================================

    @GetMapping("/{resultId}")
    @PreAuthorize("hasAuthority('GET_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResultResponse> getResult(
            @PathVariable UUID resultId) {

        return ResponseEntity.ok(
                examResultService
                        .getResult(resultId)
        );
    }


    // =====================================================
    // GET ALL RESULTS OF EXAM
    // =====================================================

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAuthority('GET_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResultResponse>>
    getResultsOfExam(
            @PathVariable UUID examId) {

        return ResponseEntity.ok(
                examResultService
                        .getResultsOfExam(examId)
        );
    }


    // =====================================================
    // GET ALL RESULTS OF STUDENT
    // =====================================================

    @GetMapping("/student/{studentClassId}")
    @PreAuthorize("hasAuthority('GET_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResultResponse>>
    getStudentResults(
            @PathVariable UUID studentClassId) {

        return ResponseEntity.ok(
                examResultService
                        .getStudentResults(
                                studentClassId
                        )
        );
    }


    // =====================================================
    // GET STUDENT RESULT OF PARTICULAR EXAM
    // =====================================================

    @GetMapping(
            "/exam/{examId}/student/{studentClassId}"
    )
    @PreAuthorize("hasAuthority('GET_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResultResponse>
    getStudentResultOfExam(
            @PathVariable UUID examId,
            @PathVariable UUID studentClassId) {

        return ResponseEntity.ok(
                examResultService
                        .getStudentResultOfExam(
                                examId,
                                studentClassId
                        )
        );
    }


    // =====================================================
    // GET RESULTS OF SUBJECT
    // =====================================================

    @GetMapping("/subject/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<List<ExamResultResponse>>
    getResultsOfSubject(
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                examResultService
                        .getResultsOfSubject(
                                classSubjectId
                        )
        );
    }


    // =====================================================
    // UPDATE MARKS
    // =====================================================

    @PatchMapping("/{resultId}")
    @PreAuthorize("hasAuthority('UPDATE_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<ExamResultResponse>
    updateResult(
            @PathVariable UUID resultId,
            @RequestParam Integer marks) {

        return ResponseEntity.ok(
                examResultService.updateResult(
                        resultId,
                        marks
                )
        );
    }


    // =====================================================
    // DELETE RESULT
    // =====================================================

    @DeleteMapping("/{resultId}")
    @PreAuthorize("hasAuthority('DELETE_EXAM_RESULT') and hasAuthority('MODULE_EXAM')")
    public ResponseEntity<Void> deleteResult(
            @PathVariable UUID resultId) {

        examResultService.deleteResult(resultId);

        return ResponseEntity.noContent().build();
    }
}