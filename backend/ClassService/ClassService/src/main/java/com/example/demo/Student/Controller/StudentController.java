package com.example.demo.Student.Controller;

import com.example.demo.Student.Request.StudentActiveRequest;
import com.example.demo.Student.Request.StudentRequest;
import com.example.demo.Student.Response.StudentResponse;
import com.example.demo.Student.Service.StudentService;
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
@RequestMapping("/api/v1/class/student")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_STUDENT')")
    public ResponseEntity<StudentResponse> createStudent(
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        studentService.createStudent(request)
                );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_STUDENT')")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }

    @GetMapping("/{studentId}")
    @PreAuthorize("hasAuthority('GET_STUDENT')")
    public ResponseEntity<StudentResponse> getStudent(
            @PathVariable UUID studentId) {

        return ResponseEntity.ok(
                studentService.getStudent(studentId)
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('GET_STUDENT')")
    public ResponseEntity<StudentResponse> getStudentByUserId(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                studentService.getStudentByUserId(userId)
        );
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_STUDENT')")
    public ResponseEntity<List<StudentResponse>> searchStudents(
            @RequestParam String name) {

        return ResponseEntity.ok(
                studentService.searchStudents(name)
        );
    }

    @PatchMapping("/{studentId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable UUID studentId,
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity.ok(
                studentService.updateStudent(
                        studentId,
                        request
                )
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public ResponseEntity<StudentResponse>
    updateStudentActive(
            @Valid @RequestBody StudentActiveRequest request) {

        return ResponseEntity.ok(
                studentService.updateStudentActiveStatus(
                        request
                )
        );
    }

    @DeleteMapping("/{studentId}")
    @PreAuthorize("hasAuthority('DELETE_STUDENT')")
    public ResponseEntity<BasicResponse> deleteStudent(
            @PathVariable UUID studentId) {

        studentService.deleteStudent(studentId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message(
                                "Student deleted successfully"
                        )
                        .build()
        );
    }
}