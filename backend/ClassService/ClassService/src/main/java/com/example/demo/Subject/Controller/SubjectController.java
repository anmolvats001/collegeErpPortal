package com.example.demo.Subject.Controller;

import com.example.demo.Subject.Request.SubjectActiveRequest;
import com.example.demo.Subject.Request.SubjectRequest;
import com.example.demo.Subject.Response.SubjectResponse;
import com.example.demo.Subject.Service.SubjectService;
import com.example.demo.common.Response.BasicResponse;
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
@RequestMapping({"/api/v1/class/subject", "/api/v1/class/subjects"})
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_SUBJECT')")
    public ResponseEntity<SubjectResponse> createSubject(
            @Valid @RequestBody SubjectRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(subjectService.createSubject(request));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_SUBJECT')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {

        return ResponseEntity.ok(
                subjectService.getAllSubjectsOfCollege()
        );
    }

    @GetMapping("/{subjectId}")
    @PreAuthorize("hasAuthority('GET_SUBJECT')")
    public ResponseEntity<SubjectResponse> getSubject(
            @PathVariable UUID subjectId) {

        return ResponseEntity.ok(
                subjectService.getSubject(subjectId)
        );
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAuthority('GET_SUBJECT')")
    public ResponseEntity<List<SubjectResponse>> getSubjectsOfCourse(
            @PathVariable UUID courseId) {

        return ResponseEntity.ok(
                subjectService.getSubjectsOfCourse(courseId)
        );
    }

    @GetMapping("/course/{courseId}/semester/{semester}")
    @PreAuthorize("hasAuthority('GET_SUBJECT')")
    public ResponseEntity<List<SubjectResponse>> getSubjectsOfCourseAndSemester(
            @PathVariable UUID courseId,
            @PathVariable Integer semester) {

        return ResponseEntity.ok(
                subjectService.getSubjectsOfCourseAndSemester(
                        courseId,
                        semester
                )
        );
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_SUBJECT')")
    public ResponseEntity<List<SubjectResponse>> searchSubjects(
            @RequestParam String subjectName) {

        return ResponseEntity.ok(
                subjectService.searchSubjects(subjectName)
        );
    }

    @PatchMapping("/{subjectId}")
    @PreAuthorize("hasAuthority('UPDATE_SUBJECT')")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable UUID subjectId,
            @Valid @RequestBody SubjectRequest request) {

        return ResponseEntity.ok(
                subjectService.updateSubject(subjectId, request)
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_SUBJECT')")
    public ResponseEntity<SubjectResponse> updateSubjectActive(
            @Valid @RequestBody SubjectActiveRequest request) {

        return ResponseEntity.ok(
                subjectService.updateSubjectActiveStatus(request)
        );
    }

    @DeleteMapping("/{subjectId}")
    @PreAuthorize("hasAuthority('DELETE_SUBJECT')")
    public ResponseEntity<BasicResponse> deleteSubject(
            @PathVariable UUID subjectId) {

        subjectService.deleteSubject(subjectId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Subject deleted successfully")
                        .build()
        );
    }
}