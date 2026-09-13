package com.CoreService.CoreService.Permission.Repository;

import com.CoreService.CoreService.Permission.Entities.RolePermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermissionEntity, String> {
    Boolean existsByRole_roleIdAndPermission_permissionId(UUID role_id, String permission_id);
    List<RolePermissionEntity> findAllByRole_roleId(UUID role_id);
    List<RolePermissionEntity> findAllByPermission_permissionIdAndRole_College_collegeId(String permission_id,UUID college_id);
    void deleteByRole_roleIdAndPermission_permissionId(UUID role_id, String permission_id);
    void deleteAllByRole_roleId(UUID role_id);
    void deleteAllByRole_College_collegeId(UUID college_id);
    RolePermissionEntity findByRole_roleId(UUID roleId);
}
