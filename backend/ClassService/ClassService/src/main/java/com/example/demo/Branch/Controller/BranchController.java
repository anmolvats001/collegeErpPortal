package com.example.demo.Branch.Controller;

import com.example.demo.Branch.Entities.Branch;
import com.example.demo.Branch.Request.BranchActiveRequest;
import com.example.demo.Branch.Request.BranchRequest;
import com.example.demo.Branch.Response.BranchResponse;
import com.example.demo.Branch.Service.BranchService;
import com.example.demo.common.Response.BasicResponse;
import com.example.demo.course.Request.CourseActiveRequest;
import com.example.demo.course.Response.CourseResponse;
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
@RequestMapping({"/api/v1/class/branch", "/api/v1/class/branches"})
public class BranchController {
    private final BranchService branchService;
    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAuthority('CREATE_BRANCH')")
    public ResponseEntity<BranchResponse> createBranch(@PathVariable UUID courseId,@Valid @RequestBody BranchRequest branchRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(branchService.createBranch(branchRequest,courseId));
    }
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAuthority('GET_BRANCH')")
    public ResponseEntity<List<BranchResponse>> getBranch(@PathVariable UUID courseId) {
        return ResponseEntity.ok(branchService.getBranchesOfCourse(courseId));
    }
    @GetMapping("/{branchId}")
    @PreAuthorize("hasAuthority('GET_BRANCH')")
    public ResponseEntity<BranchResponse> getBranchById(@PathVariable UUID branchId) {
        return ResponseEntity.ok(branchService.getBranchById(branchId));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_BRANCH')")
    public ResponseEntity<List<BranchResponse>> searchBranches(
            @RequestParam String branchName) {

        return ResponseEntity.ok(
                branchService.searchBranches(branchName)
        );
    }
    @GetMapping()
    @PreAuthorize("hasAuthority('GET_BRANCH')")
    public ResponseEntity<List<BranchResponse>> getAllBranches() {
        return ResponseEntity.ok(branchService.getAllBranchesOfCollege());
    }
    @DeleteMapping("/{branchId}")
    @PreAuthorize("hasAuthority('DELETE_BRANCH')")
    public ResponseEntity<BasicResponse> deleteBranch(@PathVariable UUID branchId) {
        branchService.deleteBranch(branchId);
        return ResponseEntity.ok(BasicResponse.builder().success(true).message("Deleted Branch").build());
    }
    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_BRANCH')")
    public ResponseEntity<BranchResponse> updateCourseActive(@RequestBody BranchActiveRequest  branchActiveRequest) {
        return ResponseEntity.ok(branchService.updateBranchActiveStatus(branchActiveRequest));
    }
    @PatchMapping("/{branchId}")
    @PreAuthorize("hasAuthority('UPDATE_BRANCH')")
    public ResponseEntity<BranchResponse> updateBranch(@RequestBody @Valid BranchRequest branchRequest,@PathVariable UUID branchId) {
        return ResponseEntity.ok(branchService.updateBranch(branchRequest,branchId));
    }
}
