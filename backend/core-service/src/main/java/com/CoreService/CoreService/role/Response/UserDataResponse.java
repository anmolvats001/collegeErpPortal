package com.CoreService.CoreService.role.Response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter

public class UserDataResponse {
    private String userId;
    private String userName;
    private String userEmail;
    private String image;
}
