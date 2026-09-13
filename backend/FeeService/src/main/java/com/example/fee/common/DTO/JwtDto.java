package com.example.fee.common.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Builder
@Getter
@Setter
public class JwtDto {

    private String userId;

    private UUID collegeId;

    private List<String> roles;

    private List<String> permissions;

    private List<String> modules;
}