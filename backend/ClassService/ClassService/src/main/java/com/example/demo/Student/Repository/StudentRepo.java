package com.example.demo.Student.Repository;

import com.example.demo.Student.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepo extends JpaRepository<Student, UUID> {

    Optional<Student> findByIdAndCollegeId(
            UUID studentId,
            UUID collegeId
    );

    Optional<Student> findByUserIdAndCollegeId(
            String userId,
            UUID collegeId
    );

    Optional<Student> findByEnrollmentNumberAndCollegeId(
            String enrollmentNumber,
            UUID collegeId
    );

    List<Student> findByCollegeId(
            UUID collegeId
    );

    List<Student> findByCollegeIdAndFirstNameContainingIgnoreCase(
            UUID collegeId,
            String firstName
    );

    boolean existsByCollegeIdAndEnrollmentNumber(
            UUID collegeId,
            String enrollmentNumber
    );

    boolean existsByCollegeIdAndUserId(
            UUID collegeId,
            String userId
    );
}