package com.example.demo.TeacherSubject.Repository;

import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeacherSubjectRepo
        extends JpaRepository<TeacherSubject, UUID> {

    Optional<TeacherSubject> findByIdAndCollegeId(
            UUID teacherSubjectId,
            UUID collegeId
    );

    List<TeacherSubject> findByCollegeId(
            UUID collegeId
    );

    List<TeacherSubject> findByCollegeIdAndTeacher_Id(
            UUID collegeId,
            UUID teacherId
    );

    List<TeacherSubject> findByCollegeIdAndClassSubject_Id(
            UUID collegeId,
            UUID classSubjectId
    );

    boolean existsByCollegeIdAndTeacher_IdAndClassSubject_Id(
            UUID collegeId,
            UUID teacherId,
            UUID classSubjectId
    );
}