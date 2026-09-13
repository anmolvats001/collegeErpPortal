package com.example.demo.Branch.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BranchResponse {
    private String branchName;
    private String branchCode;
    private String branchDescription;
    private UUID branchId;
}
