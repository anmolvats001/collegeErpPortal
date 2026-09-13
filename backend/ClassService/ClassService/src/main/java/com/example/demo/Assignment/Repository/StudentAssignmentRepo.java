package com.example.demo.Assignment.Repository;

import com.example.demo.Assignment.Entity.StudentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentAssignmentRepo
        extends JpaRepository<StudentAssignment, UUID> {

    // Check if marks already exist
    Optional<StudentAssignment>
    findByCollegeIdAndAssignment_IdAndStudentClass_Id(
            UUID collegeId,
            UUID assignmentId,
            UUID studentClassId
    );

    // Get marks of all students for one assignment
    List<StudentAssignment>
    findByCollegeIdAndAssignment_Id(
            UUID collegeId,
            UUID assignmentId
    );

    // Get all assignments/marks of one student
    List<StudentAssignment>
    findByCollegeIdAndStudentClass_Id(
            UUID collegeId,
            UUID studentClassId
    );

    // Get student's assignment marks for one ClassSubject
    List<StudentAssignment>
    findByCollegeIdAndStudentClass_IdAndAssignment_ClassSubject_Id(
            UUID collegeId,
            UUID studentClassId,
            UUID classSubjectId
    );

    // Get student's assignments for one TeacherSubject
    List<StudentAssignment>
    findByCollegeIdAndStudentClass_IdAndAssignment_TeacherSubject_Id(
            UUID collegeId,
            UUID studentClassId,
            UUID teacherSubjectId
    );
}