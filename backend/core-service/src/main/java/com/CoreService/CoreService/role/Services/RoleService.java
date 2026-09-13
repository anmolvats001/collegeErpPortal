package com.CoreService.CoreService.role.Services;

import com.CoreService.CoreService.role.Requests.RoleRequest;
import com.CoreService.CoreService.role.Response.RoleResponse;
import com.CoreService.CoreService.role.Response.UserDataResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRoles();

    RoleResponse getRoleById(UUID roleId);

    RoleResponse updateRole(UUID roleId, RoleRequest request);

    void deleteRole(UUID roleId);

    boolean existsByRoleName(String roleName);

    void assignRole(UUID roleId, String userId);

    void removeRole(UUID roleId, String userId);

    List<UserDataResponse> getUsersByRole(UUID roleId);

    List<RoleResponse> getRolesByUser(String userId);

    void removeAllRolesFromUser(String userId);

    void deleteAllRolesOfCollege(UUID collegeId);

    void deleteAllRolesByRoleId(UUID roleId);
}
