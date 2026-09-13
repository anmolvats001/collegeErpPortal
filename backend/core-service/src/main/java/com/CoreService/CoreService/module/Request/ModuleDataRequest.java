package com.CoreService.CoreService.module.Request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ModuleDataRequest {
    String moduleName;
    String moduleCode;
    String moduleDescription;
}
