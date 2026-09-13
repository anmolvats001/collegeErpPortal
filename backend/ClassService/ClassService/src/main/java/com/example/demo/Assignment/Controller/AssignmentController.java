package com.example.demo.Assignment.Controller;

import com.example.demo.Assignment.Request.AssignmentMarkRequest;
import com.example.demo.Assignment.Request.AssignmentRequest;
import com.example.demo.Assignment.Request.BulkAssignmentMarkRequest;
import com.example.demo.Assignment.Response.AssignmentResponse;
import com.example.demo.Assignment.Response.StudentAssignmentResponse;
import com.example.demo.Assignment.Service.AssignmentService;
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
@RequestMapping("/api/v1/class/assignment")
public class AssignmentController {

    private final AssignmentService assignmentService;


    // =========================================================
    // ASSIGNMENT ENDPOINTS
    // =========================================================

    // Create assignment
    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ASSIGNMENT')")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        assignmentService
                                .createAssignment(request)
                );
    }


    // Get assignment by ID
    @GetMapping("/{assignmentId}")
    @PreAuthorize("hasAuthority('GET_ASSIGNMENT')")
    public ResponseEntity<AssignmentResponse> getAssignment(
            @PathVariable UUID assignmentId) {

        return ResponseEntity.ok(
                assignmentService
                        .getAssignment(assignmentId)
        );
    }


    // Get assignments of ClassSubject
    @GetMapping("/class-subject/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_ASSIGNMENT')")
    public ResponseEntity<List<AssignmentResponse>>
    getAssignmentsOfClassSubject(
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                assignmentService
                        .getAssignmentsOfClassSubject(
                                classSubjectId
                        )
        );
    }


    // Get assignments of TeacherSubject
    @GetMapping("/teacher-subject/{teacherSubjectId}")
    @PreAuthorize("hasAuthority('GET_ASSIGNMENT')")
    public ResponseEntity<List<AssignmentResponse>>
    getAssignmentsOfTeacherSubject(
            @PathVariable UUID teacherSubjectId) {

        return ResponseEntity.ok(
                assignmentService
                        .getAssignmentsOfTeacherSubject(
                                teacherSubjectId
                        )
        );
    }


    // =========================================================
    // STUDENT ASSIGNMENT / MARKS ENDPOINTS
    // =========================================================

    // Mark one student
    @PostMapping("/marks")
    @PreAuthorize("hasAuthority('MARK_ASSIGNMENT')")
    public ResponseEntity<StudentAssignmentResponse>
    markAssignment(
            @Valid
            @RequestBody AssignmentMarkRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        assignmentService
                                .markAssignment(request)
                );
    }


    // Bulk mark students
    @PostMapping("/marks/bulk")
    @PreAuthorize("hasAuthority('MARK_ASSIGNMENT')")
    public ResponseEntity<List<StudentAssignmentResponse>>
    bulkMarkAssignment(
            @Valid
            @RequestBody BulkAssignmentMarkRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        assignmentService
                                .bulkMarkAssignment(request)
                );
    }


    // Get marks of all students for an assignment
    @GetMapping("/{assignmentId}/marks")
    @PreAuthorize("hasAuthority('GET_ASSIGNMENT')")
    public ResponseEntity<List<StudentAssignmentResponse>>
    getAssignmentMarks(
            @PathVariable UUID assignmentId) {

        return ResponseEntity.ok(
                assignmentService
                        .getAssignmentMarks(assignmentId)
        );
    }


    // Get all assignments of a student
    @GetMapping("/student/{studentClassId}")
    @PreAuthorize("hasAuthority('GET_ASSIGNMENT')")
    public ResponseEntity<List<StudentAssignmentResponse>>
    getStudentAssignments(
            @PathVariable UUID studentClassId) {

        return ResponseEntity.ok(
                assignmentService
                        .getStudentAssignments(studentClassId)
        );
    }


    // Get student's assignments for a ClassSubject
    @GetMapping(
            "/student/{studentClassId}/class-subject/{classSubjectId}"
    )
    @PreAuthorize("hasAuthority('GET_ASSIGNMENT')")
    public ResponseEntity<List<StudentAssignmentResponse>>
    getStudentSubjectAssignments(
            @PathVariable UUID studentClassId,
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                assignmentService
                        .getStudentSubjectAssignments(
                                studentClassId,
                                classSubjectId
                        )
        );
    }


    // Update marks
    @PatchMapping("/marks/{studentAssignmentId}")
    @PreAuthorize("hasAuthority('MARK_ASSIGNMENT')")
    public ResponseEntity<StudentAssignmentResponse>
    updateMarks(
            @PathVariable UUID studentAssignmentId,
            @RequestParam Integer marks) {

        return ResponseEntity.ok(
                assignmentService
                        .updateMarks(
                                studentAssignmentId,
                                marks
                        )
        );
    }
}