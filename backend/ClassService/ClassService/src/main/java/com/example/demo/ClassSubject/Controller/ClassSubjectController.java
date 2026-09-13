package com.example.demo.ClassSubject.Controller;

import com.example.demo.ClassSubject.Request.ClassSubjectActiveRequest;
import com.example.demo.ClassSubject.Request.ClassSubjectRequest;
import com.example.demo.ClassSubject.Response.ClassSubjectResponse;
import com.example.demo.ClassSubject.Service.ClassSubjectService;
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
@RequestMapping("/api/v1/class/class-subject")
public class ClassSubjectController {

    private final ClassSubjectService classSubjectService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_CLASS_SUBJECT')")
    public ResponseEntity<ClassSubjectResponse> createClassSubject(
            @Valid @RequestBody ClassSubjectRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        classSubjectService
                                .createClassSubject(request)
                );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_CLASS_SUBJECT')")
    public ResponseEntity<List<ClassSubjectResponse>>
    getAllClassSubjects() {

        return ResponseEntity.ok(
                classSubjectService.getAllClassSubjects()
        );
    }

    @GetMapping("/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_CLASS_SUBJECT')")
    public ResponseEntity<ClassSubjectResponse>
    getClassSubject(
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                classSubjectService
                        .getClassSubject(classSubjectId)
        );
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAuthority('GET_CLASS_SUBJECT')")
    public ResponseEntity<List<ClassSubjectResponse>>
    getSubjectsOfClass(
            @PathVariable UUID classId) {

        return ResponseEntity.ok(
                classSubjectService
                        .getSubjectsOfClass(classId)
        );
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAuthority('GET_CLASS_SUBJECT')")
    public ResponseEntity<List<ClassSubjectResponse>>
    getClassesOfSubject(
            @PathVariable UUID subjectId) {

        return ResponseEntity.ok(
                classSubjectService
                        .getClassesOfSubject(subjectId)
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_CLASS_SUBJECT')")
    public ResponseEntity<ClassSubjectResponse>
    updateActiveStatus(
            @Valid @RequestBody ClassSubjectActiveRequest request) {

        return ResponseEntity.ok(
                classSubjectService
                        .updateActiveStatus(request)
        );
    }

    @DeleteMapping("/{classSubjectId}")
    @PreAuthorize("hasAuthority('DELETE_CLASS_SUBJECT')")
    public ResponseEntity<BasicResponse> deleteClassSubject(
            @PathVariable UUID classSubjectId) {

        classSubjectService
                .deleteClassSubject(classSubjectId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message(
                                "Subject removed from class successfully"
                        )
                        .build()
        );
    }
}