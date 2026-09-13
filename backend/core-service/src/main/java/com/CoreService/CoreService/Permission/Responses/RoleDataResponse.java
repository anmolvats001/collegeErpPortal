package com.CoreService.CoreService.Permission.Responses;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleDataResponse {
     UUID roleId;
     String roleName;
     String roleDescription;
}
