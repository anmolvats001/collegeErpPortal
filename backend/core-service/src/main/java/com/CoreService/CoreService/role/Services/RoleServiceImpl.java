package com.CoreService.CoreService.role.Services;

import com.CoreService.CoreService.College.Entities.CollegeEntity;
import com.CoreService.CoreService.College.Repository.CollegeRepository;
import com.CoreService.CoreService.common.context.CollegeContext;
import com.CoreService.CoreService.role.Entities.Role;
import com.CoreService.CoreService.role.Entities.UserRole;
import com.CoreService.CoreService.role.Repository.RoleRepository;
import com.CoreService.CoreService.role.Repository.UserRoleRepository;
import com.CoreService.CoreService.role.Requests.RoleRequest;
import com.CoreService.CoreService.role.Response.RoleResponse;
import com.CoreService.CoreService.role.Response.UserDataResponse;
import com.CoreService.CoreService.user.Entities.UserEntity;
import com.CoreService.CoreService.user.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserRepo userRepo;
    private final CollegeRepository collegeRepository;
    private final CollegeContext collegeContext;

    @Override
    public RoleResponse createRole(RoleRequest request) {

        UUID collegeId = collegeContext.getCollegeId();

        if (roleRepository.existsByRoleNameAndCollege_collegeId(
                request.getRoleName().toUpperCase(),
                collegeId)) {
            throw new RuntimeException("Role already exists.");
        }

        CollegeEntity college = collegeRepository.findByCollegeId(collegeId)
                .orElseThrow(() -> new RuntimeException("College not found."));

        Role role = new Role();
        role.setRoleName(request.getRoleName().toUpperCase());
        role.setRoleDescription(request.getRoleDescription());
        role.setCollege(college);

        return mapToResponse(roleRepository.save(role));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {

        return roleRepository
                .findAllByCollege_collegeId(collegeContext.getCollegeId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(UUID roleId) {

        Role role = roleRepository
                .findByRoleIdAndCollege_collegeId(
                        roleId,
                        collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        return mapToResponse(role);
    }

    @Override
    public RoleResponse updateRole(UUID roleId, RoleRequest request) {

        Role role = roleRepository
                .findByRoleIdAndCollege_collegeId(
                        roleId,
                        collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        if (!role.getRoleName().equalsIgnoreCase(request.getRoleName())
                && roleRepository.existsByRoleNameAndCollege_collegeId(
                request.getRoleName().toUpperCase(),
                collegeContext.getCollegeId())) {

            throw new RuntimeException("Role already exists.");
        }

        role.setRoleName(request.getRoleName().toUpperCase());
        role.setRoleDescription(request.getRoleDescription());

        return mapToResponse(roleRepository.save(role));
    }

    @Override
    public void deleteRole(UUID roleId) {

        Role role = roleRepository
                .findByRoleIdAndCollege_collegeId(
                        roleId,
                        collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        userRoleRepository.deleteAllByRole_roleId(roleId);

        roleRepository.delete(role);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByRoleName(String roleName) {

        return roleRepository.existsByRoleNameAndCollege_collegeId(
                roleName.toUpperCase(),
                collegeContext.getCollegeId());
    }

    private RoleResponse mapToResponse(Role role) {

        RoleResponse response = new RoleResponse();

        response.setRoleId(role.getRoleId());
        response.setRoleName(role.getRoleName());
        response.setRoleDescription(role.getRoleDescription());

        return response;
    }
    @Override
    public void assignRole(UUID roleId, String userId) {

        Role role = roleRepository
                .findByRoleIdAndCollege_collegeId(
                        roleId,
                        collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.getCollegeId().equals(collegeContext.getCollegeId())) {
            throw new RuntimeException("User does not belong to this college.");
        }

        if (userRoleRepository.existsByUser_userIdAndRole_roleId(userId, roleId)) {
            throw new RuntimeException("Role already assigned.");
        }

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);

        userRoleRepository.save(userRole);
    }
    public void deleteAllRolesOfUser(String userId) {
        userRoleRepository.deleteAllByUser_userId(userId);
    }
    @Override
    public void removeRole(UUID roleId, String userId) {

        roleRepository.findByRoleIdAndCollege_collegeId(
                roleId, collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!collegeContext.getCollegeId().equals(user.getCollegeId())) {
            throw new RuntimeException("User does not belong to this college.");
        }

        if (!userRoleRepository.existsByUser_userIdAndRole_roleId(userId, roleId)) {
            throw new RuntimeException("Role assignment not found.");
        }

        userRoleRepository.deleteByUser_userIdAndRole_roleId(userId, roleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDataResponse> getUsersByRole(UUID roleId) {

        Role role = roleRepository
                .findByRoleIdAndCollege_collegeId(
                        roleId,
                        collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        return userRoleRepository.findByRole(role)
                .stream()
                .map(userRole -> UserDataResponse.builder()
                        .userId(userRole.getUser().getUserId())
                        .userName(userRole.getUser().getUserName())
                        .userEmail(userRole.getUser().getEmail())
                        .image(userRole.getUser().getImage())
                        .build())
                .collect(Collectors.toUnmodifiableList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getRolesByUser(String userId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.getCollegeId().equals(collegeContext.getCollegeId())) {
            throw new RuntimeException("User does not belong to this college.");
        }

        return userRoleRepository.findByUser(user)
                .stream()
                .map(UserRole::getRole)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void removeAllRolesFromUser(String userId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.getCollegeId().equals(collegeContext.getCollegeId())) {
            throw new RuntimeException("User does not belong to this college.");
        }

        userRoleRepository.deleteAllByUser_userId(userId);
    }

    @Override
    public void deleteAllRolesOfCollege(UUID collegeId) {

        List<Role> roles = roleRepository.findAllByCollege_collegeId(collegeId);

        for (Role role : roles) {
            userRoleRepository.deleteAllByRole_roleId(role.getRoleId());
        }

        roleRepository.deleteAll(roles);
    }

    @Override
    public void deleteAllRolesByRoleId(UUID roleId) {

        userRoleRepository.deleteAllByRole_roleId(roleId);
    }
}
