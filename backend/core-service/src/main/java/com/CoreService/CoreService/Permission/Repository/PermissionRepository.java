package com.CoreService.CoreService.Permission.Repository;

import com.CoreService.CoreService.Permission.Entities.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<PermissionEntity, String>
{
    Boolean existsByPermissionCode(String permissionCode);
    void deleteByPermissionCode(String permissionCode);
    List<PermissionEntity> findByPermissionCodeContainingIgnoreCaseOrPermissionNameContainingIgnoreCaseOrPermissionDescriptionContainingIgnoreCase(String a, String b, String c);
}
