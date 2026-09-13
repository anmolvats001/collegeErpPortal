package com.CoreService.CoreService.Permission.Responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PermissionReponse {
    String permissionName;
    String permissionDescription;
    String permissionCode;
    String permissionId;
}
