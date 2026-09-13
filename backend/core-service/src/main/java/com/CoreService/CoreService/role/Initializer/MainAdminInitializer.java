package com.CoreService.CoreService.role.Initializer;


import com.CoreService.CoreService.role.Entities.Role;
import com.CoreService.CoreService.role.Entities.UserRole;
import com.CoreService.CoreService.role.Repository.RoleRepository;
import com.CoreService.CoreService.role.Repository.UserRoleRepository;
import com.CoreService.CoreService.user.Entities.UserEntity;
import com.CoreService.CoreService.user.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(3)
public class MainAdminInitializer implements CommandLineRunner {

    private final UserRepo userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Check if Super Admin already exists
        if (userRepository.existsByEmail("vatsanmol4@gmail.com")) {
            return;
        }

        // Find SUPER_ADMIN role
        Role superAdminRole = roleRepository
                .findByRoleNameAndCollegeIsNull("MAIN_ADMIN")
                .orElseThrow(() -> new RuntimeException("MAIN_ADMIN role not found"));

        // Create Super Admin user
        UserEntity admin = UserEntity.builder()
                .userName("Main Admin")
                .userId("MainAdmin001")
                .email("vatsanmol4@gmail.com")
                .password(passwordEncoder.encode("Admin@123"))
                .activate(true)
                .build();

        admin = userRepository.save(admin);

        // Assign role
        UserRole userRole = UserRole.builder()
                .user(admin)
                .role(superAdminRole)
                .build();
        userRoleRepository.save(userRole);

        System.out.println("Super Admin created successfully.");
    }
}