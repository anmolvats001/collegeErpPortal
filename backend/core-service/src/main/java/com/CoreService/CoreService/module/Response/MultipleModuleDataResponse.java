package com.CoreService.CoreService.module.Response;

import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Getter
@Setter
public class MultipleModuleDataResponse extends BasicResponse {
    List<ModuleDataResponse> modules;
}
