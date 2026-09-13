package com.example.fee.service;

import com.example.fee.common.context.CollegeContext;
import com.example.fee.common.context.UserContext;
import com.example.fee.entity.StudentFee;
import com.example.fee.repository.StudentFeeRepository;
import com.example.fee.request.*;
import com.example.fee.response.FeeResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FeeService {
    private final StudentFeeRepository repo;

    public FeeService(StudentFeeRepository repo) {
        this.repo = repo;
    }

    public FeeResponse create(CreateFeeRequest r) {
        UUID c = requireCollege();
        if (repo.findByCollegeIdAndStudentUserId(c, r.studentUserId()).isPresent())
            throw new IllegalArgumentException("Fee already exists for this student");
        StudentFee f = new StudentFee();
        f.setCollegeId(c);
        f.setStudentUserId(r.studentUserId());
        f.setStudentName(r.studentName());
        f.setCourseId(r.courseId());
        f.setCourseName(r.courseName());
        f.setBranchId(r.branchId());
        f.setBranchName(r.branchName());
        f.setTotalFee(r.totalFee());
        f.setPaidAmount(java.math.BigDecimal.ZERO);
        return to(repo.save(f));
    }

    public FeeResponse update(UUID id, UpdateFeeRequest r) {
        StudentFee f = owned(id);
        if (r.totalFee().compareTo(f.getPaidAmount()) < 0)
            throw new IllegalArgumentException("Total fee cannot be less than already paid amount");
        f.setTotalFee(r.totalFee());
        return to(repo.save(f));
    }

    public FeeResponse getMy() {
        return to(repo.findByCollegeIdAndStudentUserId(requireCollege(), requireUser()).orElseThrow(() -> new NoSuchElementException("Fee not found")));
    }

    public FeeResponse get(UUID id) {
        return to(owned(id));
    }

    public List<FeeResponse> all() {
        return repo.findAllByCollegeId(requireCollege()).stream().map(this::to).toList();
    }

    private StudentFee owned(UUID id) {
        return repo.findById(id).filter(f -> f.getCollegeId().equals(requireCollege())).orElseThrow(() -> new NoSuchElementException("Fee not found"));
    }

    private UUID requireCollege() {
        UUID id = CollegeContext.getCollegeId();
        if (id == null) throw new IllegalStateException("College context missing");
        return id;
    }

    private String requireUser() {
        String id = UserContext.getUserId();
        if (id == null) throw new IllegalStateException("User context missing");
        return id;
    }

    private FeeResponse to(StudentFee f) {
        return new FeeResponse(f.getId(), f.getCollegeId(), f.getStudentUserId(), f.getStudentName(), f.getCourseId(), f.getCourseName(), f.getBranchId(), f.getBranchName(), f.getTotalFee(), f.getPaidAmount(), f.getRemainingAmount(), f.getStatus());
    }
}
