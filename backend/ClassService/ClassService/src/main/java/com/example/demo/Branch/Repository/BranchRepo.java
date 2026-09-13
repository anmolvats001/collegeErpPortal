package com.example.demo.Branch.Repository;

import com.example.demo.Branch.Entities.Branch;
import com.example.demo.course.Entity.Course;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BranchRepo extends CrudRepository<Branch, UUID> {
    List<Branch> findByCourse_IdAndCollegeId(UUID courseId,UUID collegeId);
    Optional<Branch>findByIdAndCollegeId(UUID id, UUID collegeId);
    List<Branch> findByCollegeId(UUID collegeId);
    List<Branch> findByCollegeIdAndBranchNameContainingIgnoreCase(
            UUID collegeId,
            String branchName
    );
}
