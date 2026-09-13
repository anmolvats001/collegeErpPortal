package com.CoreService.CoreService.College.Services;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.College.Entities.CollegeEntity;
import com.CoreService.CoreService.College.Repository.CollegeRepository;
import com.CoreService.CoreService.College.Request.CollegeDataRequest;
import com.CoreService.CoreService.Permission.Services.RolePermissionService;
import com.CoreService.CoreService.module.Services.ModuleService;
import com.CoreService.CoreService.role.Entities.Role;
import com.CoreService.CoreService.role.Entities.UserRole;
import com.CoreService.CoreService.role.Repository.RoleRepository;
import com.CoreService.CoreService.role.Repository.UserRoleRepository;
import com.CoreService.CoreService.role.Services.RoleService;
import com.CoreService.CoreService.user.Entities.UserEntity;
import com.CoreService.CoreService.user.Repository.UserRepo;
import com.CoreService.CoreService.user.Services.UserService;
import com.CoreService.CoreService.user.Services.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.CoreService.CoreService.notification.NotificationProducer;
import com.CoreService.CoreService.Permission.Entities.PermissionEntity;
import com.CoreService.CoreService.Permission.Entities.RolePermissionEntity;
import com.CoreService.CoreService.Permission.Repository.PermissionRepository;
import com.CoreService.CoreService.Permission.Repository.RolePermissionRepository;
import com.CoreService.CoreService.module.Entities.CollegeModuleEntity;
import com.CoreService.CoreService.module.Entities.ModuleEntity;
import com.CoreService.CoreService.module.Repository.CollegeModuleRepository;
import com.CoreService.CoreService.module.Repository.ModuleRepository;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final UserServiceImpl userService;
    private final ModuleService moduleService;
    private final RoleService roleService;
    private final RolePermissionService rolePermissionService;
    private final UserRepo userRepo;
    private final UserRoleRepository userRoleRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final NotificationProducer notificationProducer;
    private final RolePermissionRepository rolePermissionRepo;
    private final PermissionRepository permissionRepo;
    private final ModuleRepository moduleRepo;
    private final CollegeModuleRepository collegeModuleRepo;
    public Boolean createCollege(CollegeDataRequest collegeDataRequest) {
        if (collegeDataRequest == null) {
            return false;
        }

        CollegeEntity collegeEntity = CollegeEntity.builder()
                .collegeAddress(collegeDataRequest.getCollegeAddress())
                .collegeCity(collegeDataRequest.getCollegeCity())
                .collegeCode(collegeDataRequest.getCollegeCode())
                .collegeCountry(collegeDataRequest.getCollegeCountry())
                .collegeEmail(collegeDataRequest.getCollegeEmail())
                .collegeName(collegeDataRequest.getCollegeName())
                .collegeDescription(collegeDataRequest.getCollegeDescription())
                .collegePhone(collegeDataRequest.getCollegePhone())
                .collegeState(collegeDataRequest.getCollegeState())
                .collegeZip(collegeDataRequest.getCollegeZip())
                .universityCode(collegeDataRequest.getUniversityCode())
                .universityName(collegeDataRequest.getUniversityName())
                .build();

        CollegeEntity savedCollege = collegeRepository.save(collegeEntity);
        UserEntity collegeAdmin = UserEntity.builder()
                .userName(savedCollege.getCollegeCode() + "ADMIN")
                .userId(savedCollege.getCollegeCode() + "00001")
                .email(collegeDataRequest.getAdminEmail())
                .password(passwordEncoder.encode("CollegeAdminPassword" + savedCollege.getCollegeCode()))
                .collegeId(savedCollege.getCollegeId())
                .activate(true)
                .build();
        Role role = Role.builder()
                .college(savedCollege)
                .roleName("COLLEGE_ADMIN")
                .roleDescription("College Admin for " + savedCollege.getCollegeName())
                .build();

        UserRole userRole = UserRole.builder()
                .user(collegeAdmin)
                .role(role)
                .build();

        userRepo.save(collegeAdmin);
        roleRepo.save(role);
        userRoleRepo.save(userRole);

        // Auto-assign permissions to the new COLLEGE_ADMIN role
        List<PermissionEntity> allPermissions = permissionRepo.findAll();
        for (PermissionEntity p : allPermissions) {
            String pCode = p.getPermissionCode().toUpperCase();
            if (!pCode.contains("MAIN_ADMIN") && !pCode.contains("DELETE_ALL_COLLEGE")) {
                RolePermissionEntity rpe = RolePermissionEntity.builder()
                        .role(role)
                        .permission(p)
                        .build();
                rolePermissionRepo.save(rpe);
            }
        }

        // Auto-enable all modules for the new tenant
        List<ModuleEntity> allModules = moduleRepo.findAll();
        for (ModuleEntity m : allModules) {
            CollegeModuleEntity cme = CollegeModuleEntity.builder()
                    .college(savedCollege)
                    .module(m)
                    .enabled(true)
                    .build();
            collegeModuleRepo.save(cme);
        }

        notificationProducer.send(
                collegeAdmin.getEmail(),
                "Campus Connect - College Admin Account Created",
                "Hello " + collegeAdmin.getUserName() + ",\n\nYour college administrator account has been created for " + savedCollege.getCollegeName() + ".\nYour User ID is: " + collegeAdmin.getUserId() + "\n\nYour initial password was generated by the system. Please sign in and change it after your first login."
        );
        return true;
    }
    public Page<CollegeDto> getAllCollege( int pageNo, int pageSize ) {
        Pageable pageable = PageRequest.of( pageNo, pageSize );
        return collegeRepository .findAll(pageable) .map(this::mapToDto);
    }
    public CollegeDto getCollegeByCollegeCode(String collegeCode) {
        if (collegeCode == null || collegeCode.isBlank()) return null;
        return collegeRepository.findByCollegeCodeIgnoreCase(collegeCode).map(this::mapToDto).orElse(null);
    }
    public CollegeDto getCollegeByCollegeId(UUID collegeId) {

        Optional<CollegeEntity> collegeOptional =
                collegeRepository.findByCollegeId(collegeId);

        if (collegeOptional.isEmpty()) {
            return null;
        }

        CollegeEntity collegeEntity = collegeOptional.get();

        return CollegeDto.builder()
                .collegeDescription(collegeEntity.getCollegeDescription())
                .collegeName(collegeEntity.getCollegeName())
                .collegeCode(collegeEntity.getCollegeCode())
                .universityName(collegeEntity.getUniversityName())
                .collegeId(collegeEntity.getCollegeId())
                .collegePhone(collegeEntity.getCollegePhone())
                .collegeEmail(collegeEntity.getCollegeEmail())
                .collegeState(collegeEntity.getCollegeState())
                .collegeZip(collegeEntity.getCollegeZip())
                .collegeAddress(collegeEntity.getCollegeAddress())
                .build();
    }
    public CollegeDto updateCollegeData(UUID collegeId, CollegeDataRequest collegeDataRequest){
        try{
            Optional<CollegeEntity> collegeOptional = collegeRepository.findByCollegeId(collegeId);
            if(collegeOptional.isPresent()){
                CollegeEntity collegeEntity=collegeOptional.get();
                if(collegeDataRequest.getCollegeAddress()!=null){
                    collegeEntity.setCollegeAddress(collegeDataRequest.getCollegeAddress());
                }
                if(collegeDataRequest.getCollegeCity()!=null){
                    collegeEntity.setCollegeCity(collegeDataRequest.getCollegeCity());
                }
                if(collegeDataRequest.getCollegePhone()!=null){
                    collegeEntity.setCollegePhone(collegeDataRequest.getCollegePhone());
                }
                if(collegeDataRequest.getCollegeState()!=null){
                    collegeEntity.setCollegeState(collegeDataRequest.getCollegeState());
                }
                if(collegeDataRequest.getCollegeZip()!=null){
                    collegeEntity.setCollegeZip(collegeDataRequest.getCollegeZip());
                }
                if(collegeDataRequest.getCollegeCountry()!=null){
                    collegeEntity.setCollegeCountry(collegeDataRequest.getCollegeCountry());
                }
                if(collegeDataRequest.getCollegeEmail()!=null){
                    collegeEntity.setCollegeEmail(collegeDataRequest.getCollegeEmail());
                }
                if(collegeDataRequest.getCollegeName()!=null){
                    collegeEntity.setCollegeName(collegeDataRequest.getCollegeName());
                }
                collegeRepository.save(collegeEntity);
                return CollegeDto.builder()
                        .collegeDescription(collegeEntity.getCollegeDescription())
                        .collegeName(collegeEntity.getCollegeName())
                        .collegeCode(collegeEntity.getCollegeCode())
                        .universityName(collegeEntity.getUniversityName())
                        .collegeId(collegeEntity.getCollegeId())
                        .collegePhone(collegeEntity.getCollegePhone())
                        .collegeEmail(collegeEntity.getCollegeEmail())
                        .collegeState(collegeEntity.getCollegeState())
                        .collegeZip(collegeEntity.getCollegeZip())
                        .collegeAddress(collegeEntity.getCollegeAddress())
                        .build();
            }
            else{
                return null;
            }
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
    }
    @Transactional
    public boolean deleteCollegeData(UUID collegeId) {

        if (collegeId == null) {
            return false;
        }

        moduleService.deleteCollegeModule(collegeId);

        rolePermissionService.deleteAllRolesPermissionOfCollege(collegeId);

        userService.deleteAllUsersOfCollegeByCollegeId(collegeId);

        roleService.deleteAllRolesOfCollege(collegeId);

        collegeRepository.deleteById(collegeId);

        return true;
    }
    public CollegeDto mapToDto( CollegeEntity collegeEntity ) {
        return CollegeDto
                .builder()
                .collegeId( collegeEntity.getCollegeId() )
                .collegeName( collegeEntity.getCollegeName() )
                .collegeCode( collegeEntity.getCollegeCode() )
                .collegeDescription( collegeEntity.getCollegeDescription() )
                .collegeEmail( collegeEntity.getCollegeEmail() )
                .collegePhone( collegeEntity.getCollegePhone() )
                .collegeAddress( collegeEntity.getCollegeAddress() )
                .collegeState( collegeEntity.getCollegeState() )
                .collegeZip( collegeEntity.getCollegeZip() )
                .universityName( collegeEntity.getUniversityName() )
                .build();
    }
    public Page<CollegeDto> searchColleges(String collegeName, String universityName, String city, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (collegeName != null && universityName != null) {

            return collegeRepository
                    .findByCollegeNameContainingIgnoreCaseAndUniversityNameContainingIgnoreCase(
                            collegeName, universityName, pageable).map(this::mapToDto);
        }
        if (collegeName != null) {
            return collegeRepository.findByCollegeNameContainingIgnoreCase(
                            collegeName, pageable).map(this::mapToDto);
        }
        if (universityName != null) {
            return collegeRepository.findByUniversityNameContainingIgnoreCase(universityName, pageable).map(this::mapToDto);
        }
        if (city != null) {
            return collegeRepository
                    .findByCollegeCityContainingIgnoreCase(city, pageable)
                    .map(this::mapToDto);
        }

        return collegeRepository
                .findAll(pageable)
                .map(this::mapToDto);
    }
}
