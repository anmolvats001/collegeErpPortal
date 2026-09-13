package com.CoreService.CoreService.College.Response;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.College.Entities.CollegeEntity;
import com.CoreService.CoreService.common.Response.BasicResponse;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MultipleCollegesDataResponse extends BasicResponse {
    Page<CollegeDto> colleges;
}
