package com.CoreService.CoreService.module.Services;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.College.Entities.CollegeEntity;
import com.CoreService.CoreService.College.Repository.CollegeRepository;
import com.CoreService.CoreService.College.Services.CollegeService;
import com.CoreService.CoreService.module.Entities.CollegeModuleEntity;
import com.CoreService.CoreService.module.Entities.ModuleEntity;
import com.CoreService.CoreService.module.Repository.CollegeModuleRepository;
import com.CoreService.CoreService.module.Repository.ModuleRepository;
import com.CoreService.CoreService.module.Request.CollegeModuleRequest;
import com.CoreService.CoreService.module.Request.ModuleDataRequest;
import com.CoreService.CoreService.module.Response.ModuleDataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CollegeModuleRepository collegeModuleRepository;
    private final CollegeRepository collegeRepository;

    public boolean createModule(ModuleDataRequest module) {
        try {
            if (module == null) {
                return false;
            }
            boolean exists = moduleRepository.existsByModuleCode(module.getModuleCode());
            if (exists) {
                return false;
            }
            ModuleEntity moduleEntity = ModuleEntity.builder().moduleCode(module.getModuleCode()).moduleDescription(module.getModuleDescription()).moduleName(module.getModuleName()).build();
            if (moduleEntity == null) {
                return false;
            }
            moduleRepository.save(moduleEntity);
            return true;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public List<ModuleDataResponse> getModules() {
        List<ModuleDataResponse> modules = new ArrayList<>();
        List<ModuleEntity> moduleEntities = moduleRepository.findAll();
        for (ModuleEntity moduleEntity : moduleEntities) {
            modules.add(entityToResponse(moduleEntity));
        }
        return modules;
    }

    public ModuleDataResponse entityToResponse(ModuleEntity moduleEntity) {
        ModuleDataResponse moduleDataResponse = ModuleDataResponse.builder().moduleCode(moduleEntity.getModuleCode()).moduleDescription(moduleEntity.getModuleDescription()).moduleName(moduleEntity.getModuleName()).moduleId(moduleEntity.getModuleId()).build();
        return moduleDataResponse;
    }

    public boolean addModuleToCollege(CollegeModuleRequest collegeModuleRequest) {
        try {
            boolean exists = collegeModuleRepository.existsByCollege_collegeIdAndModule_moduleCode(collegeModuleRequest.getCollegeId(), collegeModuleRequest.getModuleCode());
            if (exists) {
                return true;
            }
            Optional<CollegeEntity> collegeEntity = collegeRepository.findByCollegeId(collegeModuleRequest.getCollegeId());
            if (!collegeEntity.isPresent()) {
                return false;
            }
            CollegeEntity collegeEntity1 = collegeEntity.get();
            Optional<ModuleEntity> moduleEntity = moduleRepository.findByModuleCode(collegeModuleRequest.getModuleCode());
            if (!moduleEntity.isPresent()) {
                return false;
            }
            ModuleEntity moduleEntity1 = moduleEntity.get();
            CollegeModuleEntity collegeModuleEntity = CollegeModuleEntity.builder().college(collegeEntity1).module(moduleEntity1).enabled(false).build();
            collegeModuleRepository.save(
                    collegeModuleEntity
            );

            return true;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public boolean changeEnablility(CollegeModuleRequest collegeModuleRequest) {
        if (collegeModuleRequest == null) {
            return false;
        }
        if (collegeModuleRequest.getCollegeId() == null) {
            return false;
        }
        if (collegeModuleRequest.getModuleCode() == null) {
            return false;
        }
        boolean exists = collegeModuleRepository.existsByCollege_collegeIdAndModule_moduleCode(collegeModuleRequest.getCollegeId(), collegeModuleRequest.getModuleCode());
        if (exists) {
            CollegeModuleEntity collegeModuleEntity = collegeModuleRepository.findByCollege_collegeIdAndModule_moduleCode(collegeModuleRequest.getCollegeId(), collegeModuleRequest.getModuleCode());
            if (collegeModuleEntity != null) {
                if(collegeModuleEntity.isEnabled() == false) {
                    collegeModuleEntity.setEnabled(true);
                }
                else{
                    collegeModuleEntity.setEnabled(false);
                }
                collegeModuleRepository.save(collegeModuleEntity);
                return true;
            }
            return false;

        }
        return false;
    }

    public List<ModuleDataResponse> getAllModulesOfCollege(UUID collegeId) {
        List<CollegeModuleEntity> entities = collegeModuleRepository.findByCollege_collegeIdAndEnabledTrue(collegeId);
        if (entities == null) {
            return null;
        }
        List<ModuleDataResponse> modules = new ArrayList<>();
        for (CollegeModuleEntity collegeModuleEntity : entities) {
            modules.add(entityToResponse(collegeModuleEntity.getModule()));
        }
        return modules;
    }

    public Page<CollegeDto> getAllCollegeIfModulePresent(String moduleCode, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<CollegeModuleEntity> collegeModules =
                collegeModuleRepository.findByModule_moduleCodeAndEnabledTrue(moduleCode, pageable);

        return collegeModules.map(collegeModule -> mapToDto(collegeModule.getCollege()));
    }
    private CollegeDto mapToDto(CollegeEntity collegeEntity) {

        return CollegeDto.builder()
                .collegeId(collegeEntity.getCollegeId())
                .collegeName(collegeEntity.getCollegeName())
                .collegeCode(collegeEntity.getCollegeCode())
                .collegeDescription(collegeEntity.getCollegeDescription())
                .collegeEmail(collegeEntity.getCollegeEmail())
                .collegePhone(collegeEntity.getCollegePhone())
                .collegeAddress(collegeEntity.getCollegeAddress())
                .collegeState(collegeEntity.getCollegeState())
                .collegeZip(collegeEntity.getCollegeZip())
                .universityName(collegeEntity.getUniversityName())
                .build();
    }
    public boolean deleteCollegeModule(UUID collegeId) {
        try {
            collegeModuleRepository.deleteAllByCollege_CollegeId(collegeId);
            return true;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
    public boolean isModuleExistInCollege(UUID collegeId, String moduleCode) {
        try{
            return collegeModuleRepository.existsByCollege_collegeIdAndModule_moduleCodeAndEnabledTrue(collegeId, moduleCode);
        }
        catch (Exception ex){
            throw new  RuntimeException(ex);
        }
    }
    public boolean deleteModuleOfCollege(UUID collegeId, String moduleCode) {
        try {
            collegeModuleRepository.deleteByCollege_collegeIdAndModule_moduleCode(collegeId, moduleCode);
            return true;
        }
        catch (Exception ex){
            throw new  RuntimeException(ex);
        }
    }
}