package com.example.demo.ExamResult.Repository;

import com.example.demo.ExamResult.Entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExamResultRepo
        extends JpaRepository<ExamResult, UUID> {

    // Get result by ID for current college
    Optional<ExamResult> findByIdAndCollegeId(
            UUID id,
            UUID collegeId
    );

    // Check whether result already exists
    Optional<ExamResult>
    findByExam_IdAndStudentClass_Id(
            UUID examId,
            UUID studentClassId
    );

    // Get all results of an exam
    List<ExamResult>
    findByCollegeIdAndExam_IdOrderByMarksDesc(
            UUID collegeId,
            UUID examId
    );

    // Get all results of a student
    List<ExamResult>
    findByCollegeIdAndStudentClass_Id(
            UUID collegeId,
            UUID studentClassId
    );

    // Get student's result of a particular exam
    Optional<ExamResult>
    findByCollegeIdAndExam_IdAndStudentClass_Id(
            UUID collegeId,
            UUID examId,
            UUID studentClassId
    );

    // Get all results of a particular subject
    List<ExamResult>
    findByCollegeIdAndExam_ClassSubject_IdOrderByExam_ExamDateAsc(
            UUID collegeId,
            UUID classSubjectId
    );
}