package com.example.demo.TeacherSubject.Controller;

import com.example.demo.TeacherSubject.Request.TeacherSubjectActiveRequest;
import com.example.demo.TeacherSubject.Request.TeacherSubjectRequest;
import com.example.demo.TeacherSubject.Response.TeacherSubjectResponse;
import com.example.demo.TeacherSubject.Service.TeacherSubjectService;
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
@RequestMapping("/api/v1/class/teacher-subject")
public class TeacherSubjectController {

    private final TeacherSubjectService teacherSubjectService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_TEACHER_SUBJECT')")
    public ResponseEntity<TeacherSubjectResponse> createTeacherSubject(
            @Valid @RequestBody TeacherSubjectRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        teacherSubjectService
                                .createTeacherSubject(request)
                );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_TEACHER_SUBJECT')")
    public ResponseEntity<List<TeacherSubjectResponse>>
    getAllTeacherSubjects() {

        return ResponseEntity.ok(
                teacherSubjectService
                        .getAllTeacherSubjects()
        );
    }

    @GetMapping("/{teacherSubjectId}")
    @PreAuthorize("hasAuthority('GET_TEACHER_SUBJECT')")
    public ResponseEntity<TeacherSubjectResponse>
    getTeacherSubject(
            @PathVariable UUID teacherSubjectId) {

        return ResponseEntity.ok(
                teacherSubjectService
                        .getTeacherSubject(teacherSubjectId)
        );
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('GET_TEACHER_SUBJECT')")
    public ResponseEntity<List<TeacherSubjectResponse>>
    getSubjectsOfTeacher(
            @PathVariable UUID teacherId) {

        return ResponseEntity.ok(
                teacherSubjectService
                        .getSubjectsOfTeacher(teacherId)
        );
    }

    @GetMapping("/class-subject/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_TEACHER_SUBJECT')")
    public ResponseEntity<List<TeacherSubjectResponse>>
    getTeachersOfClassSubject(
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                teacherSubjectService
                        .getTeachersOfClassSubject(
                                classSubjectId
                        )
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_TEACHER_SUBJECT')")
    public ResponseEntity<TeacherSubjectResponse>
    updateActiveStatus(
            @Valid @RequestBody
            TeacherSubjectActiveRequest request) {

        return ResponseEntity.ok(
                teacherSubjectService
                        .updateActiveStatus(request)
        );
    }

    @DeleteMapping("/{teacherSubjectId}")
    @PreAuthorize("hasAuthority('DELETE_TEACHER_SUBJECT')")
    public ResponseEntity<BasicResponse> deleteTeacherSubject(
            @PathVariable UUID teacherSubjectId) {

        teacherSubjectService
                .deleteTeacherSubject(teacherSubjectId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message(
                                "Teacher subject deleted successfully"
                        )
                        .build()
        );
    }
}