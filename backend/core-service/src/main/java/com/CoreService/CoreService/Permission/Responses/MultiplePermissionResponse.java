package com.CoreService.CoreService.Permission.Responses;

import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MultiplePermissionResponse extends BasicResponse {
    List<PermissionReponse> permssions;
}
