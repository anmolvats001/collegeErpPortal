package com.example.demo.StudentClass.Repository;

import com.example.demo.StudentClass.Entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentClassRepo
        extends JpaRepository<StudentClass, UUID> {

    Optional<StudentClass> findByIdAndCollegeId(
            UUID studentClassId,
            UUID collegeId
    );

    List<StudentClass> findByCollegeId(
            UUID collegeId
    );

    List<StudentClass> findByCollegeIdAndStudent_Id(
            UUID collegeId,
            UUID studentId
    );

    List<StudentClass> findByCollegeIdAndClassEntity_Id(
            UUID collegeId,
            UUID classId
    );

    List<StudentClass>
    findByCollegeIdAndClassEntity_IdAndSemester(
            UUID collegeId,
            UUID classId,
            Integer semester
    );

    boolean existsByCollegeIdAndStudent_IdAndClassEntity_IdAndAcademicYearAndSemester(
            UUID collegeId,
            UUID studentId,
            UUID classId,
            Integer academicYear,
            Integer semester
    );
    Optional<StudentClass>findByStudent_IdAndCollegeId(UUID studentId, UUID collegeId);
}