package com.CoreService.CoreService.Permission.Controller;

import com.CoreService.CoreService.Permission.Requests.UpdateRolePermissionRequest;
import com.CoreService.CoreService.Permission.Responses.MultiplePermissionResponse;
import com.CoreService.CoreService.Permission.Responses.PermissionReponse;
import com.CoreService.CoreService.Permission.Responses.RoleDataResponse;
import com.CoreService.CoreService.Permission.Services.RolePermissionService;
import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/core/rolePermission")
public class RolePermissionController {
    private final RolePermissionService rolePermissionService;
    @PreAuthorize("hasAuthority('ASSIGN_PERMISSION')")
    @PostMapping("/{roleId}/permission/{permissionId}")
    public ResponseEntity<BasicResponse> addPermissionToRole(@PathVariable UUID roleId,@PathVariable String permissionId) {
        boolean result = rolePermissionService.addPermissionToRole(roleId,permissionId);
        if (result) {
            return ResponseEntity.ok(BasicResponse.builder().success(true).message("Permission Is Added To role").build());
        }
        return ResponseEntity.badRequest().build();
    }
    @PreAuthorize("hasAuthority('GET_PERMISSION')")
    @GetMapping("/role/{roleId}")
    public ResponseEntity<MultiplePermissionResponse> getAllPermissions(@PathVariable UUID roleId) {
        List<PermissionReponse> permissionReponseList=rolePermissionService.getAllPermissionsForRole(roleId);
        return ResponseEntity.ok(MultiplePermissionResponse.builder().permssions(permissionReponseList).success(true).message("Permissions Is Returned").build());
    }
    @GetMapping("/permission/{permissionId}")
    @PreAuthorize("hasAuthority('GET_PERMISSION')")
    public ResponseEntity<List<RoleDataResponse>> getAllRolesForPermission(@PathVariable String permissionId) {
        List<RoleDataResponse> roleDataResponses= rolePermissionService.getAllRolesForPermission(permissionId);
        return ResponseEntity.ok(roleDataResponses);
    }
    @DeleteMapping("/{permissionId}/role/{roleId}")
    @PreAuthorize("hasAuthority('REMOVE_PERMISSION')")
    public ResponseEntity<BasicResponse> removePermissionFromRole(@PathVariable UUID roleId,@PathVariable String permissionId) {
        rolePermissionService.deletePermissionFromRole(roleId,permissionId);
        return ResponseEntity.ok(BasicResponse.builder().success(true).message("Permission Is Removed From role").build());
    }
    @GetMapping("/exists/{permissionId}/role/{roleId}")
    @PreAuthorize("hasAuthority('GET_PERMISSION')")
    public ResponseEntity<BasicResponse> checkIfPermissionExistsForRole(@PathVariable String permissionId,@PathVariable UUID roleId){
        boolean result= rolePermissionService.isExistsByRoleIdAndPermission_permissionId(roleId,permissionId);
        if (result) {
            return ResponseEntity.ok(BasicResponse.builder().success(true).message("Permission Exists").build());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BasicResponse.builder().message("Permission Not Found").build());
    }
    @PutMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ASSIGN_PERMISSION')")
    public ResponseEntity<BasicResponse> updateRolePermissions(
            @PathVariable UUID roleId,
            @RequestBody UpdateRolePermissionRequest request) {

        rolePermissionService.updateRolePermissions(roleId, request.getPermissionIds());

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Role permissions updated successfully.")
                        .build()
        );
    }
    @PreAuthorize("hasAuthority('ASSIGN_PERMISSION')")
    @PostMapping("/role/{roleId}/multiple-permissions")
    public ResponseEntity<BasicResponse> addMultiplePermissions(@RequestBody List<String> permisssionIds,@PathVariable UUID roleId){
        boolean result = rolePermissionService.addMultiplePermissions(permisssionIds,roleId);
        if (result) {
            return ResponseEntity.ok(BasicResponse.builder().success(true).message("Permission Is Added To role").build());
        }
        return ResponseEntity.badRequest().build();
    }
}
