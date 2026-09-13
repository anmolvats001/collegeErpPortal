package com.example.demo.Branch.Service;

import com.example.demo.Branch.Entities.Branch;
import com.example.demo.Branch.Repository.BranchRepo;
import com.example.demo.Branch.Request.BranchActiveRequest;
import com.example.demo.Branch.Request.BranchRequest;
import com.example.demo.Branch.Response.BranchResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import com.example.demo.course.Entity.Course;
import com.example.demo.course.Repository.CourseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepo branchRepo;
    private final CourseRepo courseRepo;
    public BranchResponse createBranch(BranchRequest branchRequest, UUID courseId) {
        Course course = courseRepo.findById(courseId).orElseThrow(()->new RuntimeException("Course not found"));
        if (!CollegeContext.getCollegeId().equals(course.getCollegeId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }
        Branch branch = Branch.builder()
                .branchDescription(branchRequest.getBranchDescription())
                .branchName(branchRequest.getBranchName())
                .branchCode(branchRequest.getBranchCode())
                .collegeId(course.getCollegeId())
                .createdBy(UserContext.getUserId())
                .updatedBy(UserContext.getUserId())
                .course(course)
        .build();
        Branch branchFromRepo=  branchRepo.save(branch);
        return createBranchResponse(branchFromRepo);
    }
    public List<BranchResponse> getBranchesOfCourse(UUID courseId) {
        List<Branch> branches= branchRepo.findByCourse_IdAndCollegeId(courseId, CollegeContext.getCollegeId());
        List<BranchResponse> branchesResponse = new ArrayList<>();
        for(Branch branch:branches){
            branchesResponse.add(createBranchResponse(branch));
        }
        return branchesResponse;
    }
    public BranchResponse getBranchById(UUID id) {
        Branch branch = branchRepo.findByIdAndCollegeId(id,CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Branch not found"));
        return createBranchResponse(branch);
    }
    public List<BranchResponse> searchBranches(String branchName) {
        List<Branch> branches= branchRepo.findByCollegeIdAndBranchNameContainingIgnoreCase(CollegeContext.getCollegeId(), branchName);
        List<BranchResponse> branchesResponse = new ArrayList<>();
        for(Branch branch:branches){
            branchesResponse.add(createBranchResponse(branch));
        }
        return branchesResponse;
    }
    public List<BranchResponse> getAllBranchesOfCollege() {
        List<Branch>  branches= branchRepo.findByCollegeId(CollegeContext.getCollegeId());
        List<BranchResponse> branchesResponse = new ArrayList<>();
        for(Branch branch:branches){
            branchesResponse.add(createBranchResponse(branch));
        }
        return branchesResponse;
    }
    public void deleteBranch(UUID id) {
        Branch branch=branchRepo.findById(id).orElseThrow(()->new RuntimeException("Branch not found"));
        branchRepo.deleteById(id);
    }
    public BranchResponse updateBranchActiveStatus(BranchActiveRequest branchActiveRequest) {
        Branch branch = branchRepo.findByIdAndCollegeId(branchActiveRequest.getBranchId(),CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Branch not found"));
        branch.setIsActive(branchActiveRequest.isActive());
       Branch branchFromRepo= branchRepo.save(branch);
        return createBranchResponse(branchFromRepo);
    }
    public BranchResponse updateBranch(BranchRequest branchRequest, UUID branchId) {
        Branch branch= branchRepo.findById(branchId).orElseThrow(()->new RuntimeException("Branch not found"));
        branch.setBranchDescription(branchRequest.getBranchDescription());
        branch.setBranchCode(branchRequest.getBranchCode());
        branch.setCollegeId(CollegeContext.getCollegeId());
        branch.setBranchName(branchRequest.getBranchName());
        branch.setUpdatedBy(UserContext.getUserId());
        Branch branchFromRepo= branchRepo.save(branch);
        return createBranchResponse(branchFromRepo);
    }
    private BranchResponse createBranchResponse(Branch branch) {
        return BranchResponse.builder().branchDescription(branch.getBranchDescription()).branchCode(branch.getBranchCode())
                .branchId(branch.getId())
                .branchName(branch.getBranchName()).build();
    }

}
