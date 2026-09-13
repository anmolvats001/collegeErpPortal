package com.CoreService.CoreService.role.Repository;

import com.CoreService.CoreService.role.Entities.Role;
import com.CoreService.CoreService.role.Entities.UserRole;
import com.CoreService.CoreService.user.Entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole,String> {
    boolean existsByUser_userIdAndRole_roleId(String userId, UUID roleId);

    void deleteByUser_userIdAndRole_roleId(String userId, UUID roleId);

    List<UserRole> findByRole(Role role);

    List<UserRole> findByUser(UserEntity user);

    void deleteAllByUser_userId(String userId);

    void deleteAllByRole_roleId(UUID roleId);
}
