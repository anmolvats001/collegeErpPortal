package com.CoreService.CoreService.role.Initializer;

import com.CoreService.CoreService.Permission.Entities.PermissionEntity;
import com.CoreService.CoreService.Permission.Entities.RolePermissionEntity;
import com.CoreService.CoreService.Permission.Repository.PermissionRepository;
import com.CoreService.CoreService.Permission.Repository.RolePermissionRepository;
import com.CoreService.CoreService.role.Entities.Role;
import com.CoreService.CoreService.role.Repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(2)
public class Initializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    public void run(String... args) {

        Role superAdminRole;

        if (roleRepository.existsByRoleNameAndCollegeIsNull("MAIN_ADMIN")) {

            superAdminRole = roleRepository
                    .findByRoleNameAndCollegeIsNull("MAIN_ADMIN")
                    .orElseThrow();

        } else {

            superAdminRole = Role.builder()
                    .roleName("MAIN_ADMIN")
                    .roleDescription("Platform Super Admin")
                    .college(null)
                    .build();

            superAdminRole = roleRepository.save(superAdminRole);
        }

        List<PermissionEntity> permissions = permissionRepository.findAll();

        for (PermissionEntity permission : permissions) {

            if (!rolePermissionRepository.existsByRole_roleIdAndPermission_permissionId(
                    superAdminRole.getRoleId(),
                    permission.getPermissionId())) {

                rolePermissionRepository.save(
                        RolePermissionEntity.builder()
                                .role(superAdminRole)
                                .permission(permission)
                                .build()
                );
            }
        }

        System.out.println("MAIN_ADMIN role initialized successfully.");
    }
}