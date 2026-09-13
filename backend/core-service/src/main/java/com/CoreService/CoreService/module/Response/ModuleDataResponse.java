package com.CoreService.CoreService.module.Response;

import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class ModuleDataResponse extends BasicResponse {
    private String moduleName;
    private String moduleCode;
    private String moduleDescription;
    private String moduleId;
}
