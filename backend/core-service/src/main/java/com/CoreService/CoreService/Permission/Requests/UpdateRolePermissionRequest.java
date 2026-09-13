package com.CoreService.CoreService.Permission.Requests;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter

public class UpdateRolePermissionRequest {

    private List<String> permissionIds;

}