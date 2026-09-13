package com.example.demo.Teacher.Controller;

import com.example.demo.Teacher.Request.TeacherActiveRequest;
import com.example.demo.Teacher.Request.TeacherRequest;
import com.example.demo.Teacher.Response.TeacherResponse;
import com.example.demo.Teacher.Service.TeacherService;
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
@RequestMapping("/api/v1/class/teacher")
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_TEACHER')")
    public ResponseEntity<TeacherResponse> createTeacher(
            @Valid @RequestBody TeacherRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        teacherService.createTeacher(request)
                );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_TEACHER')")
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {

        return ResponseEntity.ok(
                teacherService.getAllTeachers()
        );
    }

    @GetMapping("/{teacherId}")
    @PreAuthorize("hasAuthority('GET_TEACHER')")
    public ResponseEntity<TeacherResponse> getTeacher(
            @PathVariable UUID teacherId) {

        return ResponseEntity.ok(
                teacherService.getTeacher(teacherId)
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('GET_TEACHER')")
    public ResponseEntity<TeacherResponse> getTeacherByUserId(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                teacherService.getTeacherByUserId(userId)
        );
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_TEACHER')")
    public ResponseEntity<List<TeacherResponse>> searchTeachers(
            @RequestParam String name) {

        return ResponseEntity.ok(
                teacherService.searchTeachers(name)
        );
    }

    @PatchMapping("/{teacherId}")
    @PreAuthorize("hasAuthority('UPDATE_TEACHER')")
    public ResponseEntity<TeacherResponse> updateTeacher(
            @PathVariable UUID teacherId,
            @Valid @RequestBody TeacherRequest request) {

        return ResponseEntity.ok(
                teacherService.updateTeacher(
                        teacherId,
                        request
                )
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_TEACHER')")
    public ResponseEntity<TeacherResponse> updateTeacherActive(
            @Valid @RequestBody TeacherActiveRequest request) {

        return ResponseEntity.ok(
                teacherService.updateTeacherActiveStatus(
                        request
                )
        );
    }

    @DeleteMapping("/{teacherId}")
    @PreAuthorize("hasAuthority('DELETE_TEACHER')")
    public ResponseEntity<BasicResponse> deleteTeacher(
            @PathVariable UUID teacherId) {

        teacherService.deleteTeacher(teacherId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message(
                                "Teacher deleted successfully"
                        )
                        .build()
        );
    }
}