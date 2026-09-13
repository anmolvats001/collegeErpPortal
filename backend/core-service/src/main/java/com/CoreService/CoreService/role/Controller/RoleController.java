package com.CoreService.CoreService.role.Controller;

import com.CoreService.CoreService.common.Response.BasicResponse;
import com.CoreService.CoreService.role.Requests.RoleRequest;
import com.CoreService.CoreService.role.Response.RoleResponse;
import com.CoreService.CoreService.role.Response.UserDataResponse;
import com.CoreService.CoreService.role.Services.RoleService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/core/roles")
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody RoleRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roleService.createRole(request));
    }


    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    public ResponseEntity<RoleResponse> getRoleById(
            @PathVariable UUID roleId) {

        return ResponseEntity.ok(roleService.getRoleById(roleId));
    }

    @PutMapping("/{roleId}")
    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable UUID roleId,
            @Valid @RequestBody RoleRequest request) {

        return ResponseEntity.ok(roleService.updateRole(roleId, request));
    }

    @DeleteMapping("/{roleId}")
    @PreAuthorize("hasAuthority('DELETE_ROLE')")
    public ResponseEntity<BasicResponse> deleteRole(
            @PathVariable UUID roleId) {

        roleService.deleteRole(roleId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Role deleted successfully.")
                        .build()
        );
    }

    @GetMapping("/exists/{roleName}")
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    public ResponseEntity<Boolean> existsByRoleName(
            @PathVariable String roleName) {

        return ResponseEntity.ok(roleService.existsByRoleName(roleName));
    }

    @PostMapping("/{roleId}/users/{userId}")
    @PreAuthorize("hasAuthority('ASSIGN_ROLE')")
    public ResponseEntity<BasicResponse> assignRole(
            @PathVariable UUID roleId,
            @PathVariable String userId) {

        roleService.assignRole(roleId, userId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Role assigned successfully.")
                        .build()
        );
    }

    @DeleteMapping("/{roleId}/users/{userId}")
    @PreAuthorize("hasAuthority('REMOVE_ROLE')")
    public ResponseEntity<BasicResponse> removeRole(
            @PathVariable UUID roleId,
            @PathVariable String userId) {

        roleService.removeRole(roleId, userId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Role removed successfully.")
                        .build()
        );
    }

    @GetMapping("/{roleId}/users")
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    public ResponseEntity<List<UserDataResponse>> getUsersByRole(
            @PathVariable UUID roleId) {

        return ResponseEntity.ok(roleService.getUsersByRole(roleId));
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    public ResponseEntity<List<RoleResponse>> getRolesByUser(
            @PathVariable String userId) {

        return ResponseEntity.ok(roleService.getRolesByUser(userId));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('REMOVE_ROLE')")
    public ResponseEntity<BasicResponse> removeAllRolesFromUser(
            @PathVariable String userId) {

        roleService.removeAllRolesFromUser(userId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("All roles removed successfully.")
                        .build()
        );
    }

}
