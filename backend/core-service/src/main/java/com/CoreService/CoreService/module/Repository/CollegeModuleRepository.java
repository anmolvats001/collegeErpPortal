package com.CoreService.CoreService.module.Repository;

import com.CoreService.CoreService.module.Entities.CollegeModuleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CollegeModuleRepository extends JpaRepository<CollegeModuleEntity,Long> {

    CollegeModuleEntity findByCollege_collegeIdAndModule_moduleCode(UUID collegeId,String moduleCode);
    List<CollegeModuleEntity> findByCollege_collegeIdAndEnabledTrue(UUID collegeId);
    Boolean existsByCollege_collegeIdAndModule_moduleCodeAndEnabledTrue(UUID collegeId, String moduleCode);
    Boolean existsByCollege_collegeIdAndModule_moduleCode(UUID collegeId, String moduleCode);
    Page<CollegeModuleEntity> findByModule_moduleCodeAndEnabledTrue(String moduleCode, Pageable pageable);
    void deleteAllByCollege_CollegeId(UUID collegeId);
    void deleteByCollege_collegeIdAndModule_moduleCode(UUID collegeId, String moduleCode);
}
