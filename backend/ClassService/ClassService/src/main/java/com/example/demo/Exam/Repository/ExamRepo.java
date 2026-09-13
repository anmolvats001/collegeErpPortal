package com.example.demo.Exam.Repository;

import com.example.demo.Exam.Entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ExamRepo
        extends JpaRepository<Exam, UUID> {

    // All exams of current college
    List<Exam> findByCollegeIdOrderByExamDateAscStartTimeAsc(
            UUID collegeId
    );

    // Exams of a particular ClassSubject
    List<Exam> findByCollegeIdAndClassSubject_IdOrderByExamDateAscStartTimeAsc(
            UUID collegeId,
            UUID classSubjectId
    );

    // Exams handled by a particular TeacherSubject
    List<Exam> findByCollegeIdAndTeacherSubject_IdOrderByExamDateAscStartTimeAsc(
            UUID collegeId,
            UUID teacherSubjectId
    );

    // Exams on a particular date
    List<Exam> findByCollegeIdAndExamDateOrderByStartTimeAsc(
            UUID collegeId,
            LocalDate examDate
    );

    // Exams of a particular type
    List<Exam> findByCollegeIdAndExamTypeOrderByExamDateAscStartTimeAsc(
            UUID collegeId,
            com.example.demo.Exam.Entity.ExamType examType
    );
}