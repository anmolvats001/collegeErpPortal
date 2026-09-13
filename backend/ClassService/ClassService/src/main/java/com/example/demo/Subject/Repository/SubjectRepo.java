package com.example.demo.Subject.Repository;

import com.example.demo.Subject.Entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubjectRepo extends JpaRepository<Subject, UUID> {

    Optional<Subject> findByIdAndCollegeId(
            UUID subjectId,
            UUID collegeId
    );

    List<Subject> findByCollegeId(
            UUID collegeId
    );

    List<Subject> findByCollegeIdAndCourse_Id(
            UUID collegeId,
            UUID courseId
    );

    List<Subject> findByCollegeIdAndCourse_IdAndSemester(
            UUID collegeId,
            UUID courseId,
            Integer semester
    );

    List<Subject> findByCollegeIdAndSubjectNameContainingIgnoreCase(
            UUID collegeId,
            String subjectName
    );

    boolean existsByCollegeIdAndCourse_IdAndSemesterAndSubjectCode(
            UUID collegeId,
            UUID courseId,
            Integer semester,
            String subjectCode
    );
}