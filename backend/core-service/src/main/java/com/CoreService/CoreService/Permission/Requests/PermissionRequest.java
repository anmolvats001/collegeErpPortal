package com.CoreService.CoreService.Permission.Requests;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionRequest {
    String permissionName;
    String permissionCode;
    String permissionDescription;
}
