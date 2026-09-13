package com.example.demo.Class.Repository;
import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Class.Response.ClassResponse;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassRepo extends CrudRepository<ClassEntity, UUID> {
    List<ClassEntity> findByBranch_IdAndSemester(
            UUID branchId,
            Integer semester
    );
    List<ClassEntity> findByBranch_Id(UUID branchId);
    List<ClassEntity> findByCollegeId(UUID collegeId);
    List<ClassEntity> findByCollegeIdAndClassNameContainingIgnoreCase(
            UUID collegeId,
            String className
    );
    Optional<ClassEntity> findByIdAndCollegeId(UUID id, UUID collegeId);
}
