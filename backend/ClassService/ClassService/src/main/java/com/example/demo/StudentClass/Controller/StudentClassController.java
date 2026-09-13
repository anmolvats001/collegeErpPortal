package com.example.demo.StudentClass.Controller;

import com.example.demo.StudentClass.Request.StudentClassActiveRequest;
import com.example.demo.StudentClass.Request.StudentClassRequest;
import com.example.demo.StudentClass.Response.StudentClassResponse;
import com.example.demo.StudentClass.Service.StudentClassService;
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
@RequestMapping("/api/v1/class/student-class")
public class StudentClassController {

    private final StudentClassService studentClassService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_STUDENT_CLASS')")
    public ResponseEntity<StudentClassResponse> createStudentClass(
            @Valid @RequestBody StudentClassRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        studentClassService
                                .createStudentClass(request)
                );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_STUDENT_CLASS')")
    public ResponseEntity<List<StudentClassResponse>>
    getAllStudentClasses() {

        return ResponseEntity.ok(
                studentClassService
                        .getAllStudentClasses()
        );
    }

    @GetMapping("/{studentClassId}")
    @PreAuthorize("hasAuthority('GET_STUDENT_CLASS')")
    public ResponseEntity<StudentClassResponse>
    getStudentClass(
            @PathVariable UUID studentClassId) {

        return ResponseEntity.ok(
                studentClassService
                        .getStudentClass(studentClassId)
        );
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAuthority('GET_STUDENT_CLASS')")
    public ResponseEntity<List<StudentClassResponse>>
    getClassesOfStudent(
            @PathVariable UUID studentId) {

        return ResponseEntity.ok(
                studentClassService
                        .getClassesOfStudent(studentId)
        );
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAuthority('GET_STUDENT_CLASS')")
    public ResponseEntity<List<StudentClassResponse>>
    getStudentsOfClass(
            @PathVariable UUID classId) {

        return ResponseEntity.ok(
                studentClassService
                        .getStudentsOfClass(classId)
        );
    }

    @GetMapping(
            "/class/{classId}/semester/{semester}"
    )
    @PreAuthorize("hasAuthority('GET_STUDENT_CLASS')")
    public ResponseEntity<List<StudentClassResponse>>
    getStudentsOfClassAndSemester(
            @PathVariable UUID classId,
            @PathVariable Integer semester) {

        return ResponseEntity.ok(
                studentClassService
                        .getStudentsOfClassAndSemester(
                                classId,
                                semester
                        )
        );
    }

    @PatchMapping("/{studentClassId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT_CLASS')")
    public ResponseEntity<StudentClassResponse>
    updateStudentClass(
            @PathVariable UUID studentClassId,
            @Valid @RequestBody StudentClassRequest request) {

        return ResponseEntity.ok(
                studentClassService.updateStudentClass(
                        studentClassId,
                        request
                )
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT_CLASS')")
    public ResponseEntity<StudentClassResponse>
    updateActiveStatus(
            @Valid @RequestBody
            StudentClassActiveRequest request) {

        return ResponseEntity.ok(
                studentClassService
                        .updateActiveStatus(request)
        );
    }

    @DeleteMapping("/{studentClassId}")
    @PreAuthorize("hasAuthority('DELETE_STUDENT_CLASS')")
    public ResponseEntity<BasicResponse>
    deleteStudentClass(
            @PathVariable UUID studentClassId) {

        studentClassService
                .deleteStudentClass(studentClassId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message(
                                "Student class deleted successfully"
                        )
                        .build()
        );
    }
}