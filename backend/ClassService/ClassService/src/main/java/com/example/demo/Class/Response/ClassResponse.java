package com.example.demo.Class.Response;

import com.example.demo.Branch.Entities.Branch;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class ClassResponse {
    private UUID classId;
    private String className;
    private String section;
    private String branchName;
    private Integer academicYear;
    private Integer semester;
}
