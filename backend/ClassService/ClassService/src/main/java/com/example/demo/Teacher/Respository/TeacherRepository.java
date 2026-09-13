package com.example.demo.Teacher.Repository;

import com.example.demo.Teacher.Entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    Optional<Teacher> findByIdAndCollegeId(
            UUID teacherId,
            UUID collegeId
    );

    Optional<Teacher> findByUserIdAndCollegeId(
            String userId,
            UUID collegeId
    );

    Optional<Teacher> findByEmployeeIdAndCollegeId(
            String employeeId,
            UUID collegeId
    );

    List<Teacher> findByCollegeId(
            UUID collegeId
    );

    List<Teacher> findByCollegeIdAndFirstNameContainingIgnoreCase(
            UUID collegeId,
            String firstName
    );

    boolean existsByCollegeIdAndEmployeeId(
            UUID collegeId,
            String employeeId
    );

    boolean existsByCollegeIdAndUserId(
            UUID collegeId,
            String userId
    );
}