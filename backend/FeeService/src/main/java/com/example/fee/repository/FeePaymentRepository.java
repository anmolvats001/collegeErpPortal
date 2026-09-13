package com.example.fee.repository;

import com.example.fee.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface FeePaymentRepository extends JpaRepository<FeePayment, UUID> {
    List<FeePayment> findAllByCollegeIdOrderBySubmittedAtDesc(UUID collegeId);

    List<FeePayment> findAllByCollegeIdAndStudentUserIdOrderBySubmittedAtDesc(UUID collegeId, String studentUserId);

    boolean existsByCollegeIdAndStudentUserIdAndStatus(UUID collegeId, String studentUserId, PaymentStatus status);
}
