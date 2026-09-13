package com.CoreService.CoreService.College.Dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@SuperBuilder
@Getter
@Setter
public class CollegeDto {
    UUID collegeId;
    private String collegeName;
    private String collegeCode;
    private String collegePhone;
    private String collegeEmail;
    private String collegeAddress;
    private String collegeCity;
    private String collegeState;
    private String collegeZip;
    private String collegeCountry;
    private String universityName;
    private String universityCode;
    private String collegeDescription;
}
