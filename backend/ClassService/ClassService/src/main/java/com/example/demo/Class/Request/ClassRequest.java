package com.example.demo.Class.Request;

import com.example.demo.Branch.Entities.Branch;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClassRequest {
    @NotBlank(message = "Class Name can't be blank")
    private String className;
    @NotBlank(message = "Class Section can't be blank")
    private String section;
    @NotNull(message = "Branch Id can't be null")
    private UUID branchId;
    @NotNull(message = "Academic year can't be null")
    private Integer academicYear;
    @NotNull(message = "Semester number can't be null")
    private Integer semester;
}
