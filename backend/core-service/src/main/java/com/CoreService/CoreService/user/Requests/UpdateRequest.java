package com.CoreService.CoreService.user.Requests;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter

public class UpdateRequest {
    private String userName;
    private Long phoneNumber;
    private Long alternatePhoneNumber;
    private String bloodGroup;
    private String image;
}
