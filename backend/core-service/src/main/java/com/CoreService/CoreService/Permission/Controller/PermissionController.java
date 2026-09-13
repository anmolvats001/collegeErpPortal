package com.CoreService.CoreService.Permission.Controller;

import com.CoreService.CoreService.Permission.Requests.PermissionRequest;
import com.CoreService.CoreService.Permission.Responses.MultiplePermissionResponse;
import com.CoreService.CoreService.Permission.Services.PermissionService;
import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/core/permission")
public class PermissionController {
    private final PermissionService permissionService;

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @PostMapping("/addPermission")
    public ResponseEntity<BasicResponse> addPermission(@RequestBody PermissionRequest permissionRequest) {
        boolean result = permissionService.addPermission(permissionRequest);
        if (result) {
            return ResponseEntity.ok(BasicResponse.builder().success(true).message("New Permission added").build());
        }
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(BasicResponse.builder().success(false).message("Permission Not Implemented").build());
    }
    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @DeleteMapping("/{permissionCode}")
    public ResponseEntity<BasicResponse> deletePermission(@PathVariable String permissionCode) {
        permissionService.deletePermission(permissionCode);
        return ResponseEntity.ok(BasicResponse.builder().success(true).message("Permission Deleted").build());
    }
    @GetMapping("/all")
@PreAuthorize("hasAuthority('GET_PERMISSION')")
    public ResponseEntity<MultiplePermissionResponse> getAllPermissions() {
        MultiplePermissionResponse response=permissionService.getAllPermissions();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_PERMISSION')")
    public ResponseEntity<MultiplePermissionResponse> searchPermissions(
            @RequestParam String keyword) {

        return ResponseEntity.ok(permissionService.searchPermissions(keyword));
    }

    @GetMapping("/exists/{permissionCode}")
    @PreAuthorize("hasAuthority('GET_PERMISSION')")
    public ResponseEntity<BasicResponse> existsByPermissionCode(
            @PathVariable String permissionCode) {

        return ResponseEntity.ok(BasicResponse.builder().success(permissionService.existsByPermissionCode(permissionCode)).message("").build());
    }

}
