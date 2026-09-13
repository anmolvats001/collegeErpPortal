package com.example.demo.Branch.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BranchRequest {
    @NotBlank(message = "Branch Name can't be blank")
    private String branchName;
    @NotNull(message = "Branch code can't be null")
    private String branchCode;
    private String branchDescription;
}