package com.example.demo.Assignment.Repository;

import com.example.demo.Assignment.Entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepo
        extends JpaRepository<Assignment, UUID> {

    // All assignments of a ClassSubject
    List<Assignment>
    findByCollegeIdAndClassSubject_IdOrderByCreatedAtAsc(
            UUID collegeId,
            UUID classSubjectId
    );

    // All assignments created/handled by a TeacherSubject
    List<Assignment>
    findByCollegeIdAndTeacherSubject_IdOrderByCreatedAtAsc(
            UUID collegeId,
            UUID teacherSubjectId
    );

    // All assignments of current college
    List<Assignment>
    findByCollegeIdOrderByCreatedAtAsc(
            UUID collegeId
    );
}