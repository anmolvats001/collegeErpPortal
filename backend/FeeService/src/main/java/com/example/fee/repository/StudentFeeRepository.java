package com.example.fee.repository;

import com.example.fee.entity.StudentFee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface StudentFeeRepository extends JpaRepository<StudentFee, UUID> {
    Optional<StudentFee> findByCollegeIdAndStudentUserId(UUID collegeId, String studentUserId);

    List<StudentFee> findAllByCollegeId(UUID collegeId);
}
