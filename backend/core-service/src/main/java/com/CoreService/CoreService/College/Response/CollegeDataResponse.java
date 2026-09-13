package com.CoreService.CoreService.College.Response;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class CollegeDataResponse extends BasicResponse {
    CollegeDto college;
}
