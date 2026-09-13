package com.example.demo.Class.Controller;

import com.example.demo.Class.Request.ClassActiveRequest;
import com.example.demo.Class.Request.ClassRequest;
import com.example.demo.Class.Response.ClassResponse;

import com.example.demo.Class.Service.ClassService;
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
@RequestMapping("/api/v1/class/classes")
public class ClassController {

    private final ClassService classService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_CLASS')")
    public ResponseEntity<ClassResponse> createClass(
            @Valid @RequestBody ClassRequest classRequest) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(classService.createClass(classRequest));
    }

    @GetMapping("/branch/{branchId}/semester/{semester}")
    @PreAuthorize("hasAuthority('GET_CLASS')")
    public ResponseEntity<List<ClassResponse>> getClassesByBranchAndSemester(
            @PathVariable UUID branchId,
            @PathVariable Integer semester) {

        return ResponseEntity.ok(
                classService.getAllClassesOfBranchAndSemester(
                        branchId,
                        semester
                )
        );
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAuthority('GET_CLASS')")
    public ResponseEntity<List<ClassResponse>> getClassesByBranch(
            @PathVariable UUID branchId) {

        return ResponseEntity.ok(
                classService.getClassesByBranch(branchId)
        );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_CLASS')")
    public ResponseEntity<List<ClassResponse>> getAllClasses() {

        return ResponseEntity.ok(
                classService.getAllClassesOfCollege()
        );
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_CLASS')")
    public ResponseEntity<List<ClassResponse>> searchClasses(
            @RequestParam String className) {

        return ResponseEntity.ok(
                classService.searchClasses(className)
        );
    }

    @GetMapping("/{classId}")
    @PreAuthorize("hasAuthority('GET_CLASS')")
    public ResponseEntity<ClassResponse> getClassById(
            @PathVariable UUID classId) {

        return ResponseEntity.ok(
                classService.getClassByClassId(classId)
        );
    }

    @PatchMapping("/{classId}")
    @PreAuthorize("hasAuthority('UPDATE_CLASS')")
    public ResponseEntity<ClassResponse> updateClass(
            @PathVariable UUID classId,
            @Valid @RequestBody ClassRequest classRequest) {

        return ResponseEntity.ok(
                classService.updateClass(classId, classRequest)
        );
    }

    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_CLASS')")
    public ResponseEntity<ClassResponse> updateClassActive(
            @Valid @RequestBody ClassActiveRequest request) {

        return ResponseEntity.ok(
                classService.updateClassActiveStatus(request)
        );
    }

    @DeleteMapping("/{classId}")
    @PreAuthorize("hasAuthority('DELETE_CLASS')")
    public ResponseEntity<BasicResponse> deleteClass(
            @PathVariable UUID classId) {

        classService.deleteClass(classId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Class deleted successfully")
                        .build()
        );
    }
}