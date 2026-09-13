package com.CoreService.CoreService.College.Request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.NonNull;

import java.util.UUID;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class CollegeDataRequest {
    @NotBlank(message = "College name can't be blank")
    private String collegeName;
    @NotBlank(message = "College code can't be blank")
    private String collegeCode;

    @NotBlank(message = "College phone can't be blank")
    private String collegePhone;

    @NotBlank(message = "College email can't be blank")
    private String collegeEmail;
    private String collegeAddress;
    private String collegeCity;
    private String collegeState;
    private String collegeZip;
    private String collegeCountry;

    @NotBlank(message = "university name can't be blank")
    private String universityName;

    @NotBlank(message = "University Code can't be blank")
    private String universityCode;
    private String collegeDescription;

    @Email(message = "Give a valid email for admin")
    private String adminEmail;
}
