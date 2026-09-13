package com.CoreService.CoreService.module.Repository;

import com.CoreService.CoreService.module.Entities.CollegeModuleEntity;
import com.CoreService.CoreService.module.Entities.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<ModuleEntity,String> {
    Boolean existsByModuleCode(String moduleCode);
    Optional<ModuleEntity> findByModuleCode(String moduleCode);
    Optional<ModuleEntity> findByModuleId(String moduleId);
}
