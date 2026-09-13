package com.CoreService.CoreService.role.Response;

import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;


@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse  extends BasicResponse {
    private UUID roleId;
    private String roleName;
    private String roleDescription;
}
