package com.example.demo.ClassSubject.Repository;

import com.example.demo.ClassSubject.Entity.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassSubjectRepo
        extends JpaRepository<ClassSubject, UUID> {

    Optional<ClassSubject> findByIdAndCollegeId(
            UUID id,
            UUID collegeId
    );

    List<ClassSubject> findByCollegeId(
            UUID collegeId
    );

    List<ClassSubject> findByCollegeIdAndClassEntity_Id(
            UUID collegeId,
            UUID classId
    );

    List<ClassSubject> findByCollegeIdAndSubject_Id(
            UUID collegeId,
            UUID subjectId
    );

    boolean existsByCollegeIdAndClassEntity_IdAndSubject_Id(
            UUID collegeId,
            UUID classId,
            UUID subjectId
    );
}