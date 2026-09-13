package com.CoreService.CoreService.module.Request;

import lombok.*;

import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class CollegeModuleRequest {
    private String moduleCode;
    private UUID collegeId;
}
