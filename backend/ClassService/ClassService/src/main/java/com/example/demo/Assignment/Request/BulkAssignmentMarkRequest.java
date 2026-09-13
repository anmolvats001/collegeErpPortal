package com.example.demo.Assignment.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkAssignmentMarkRequest {

    @NotEmpty
    @Valid
    private List<AssignmentMarkRequest> marks;
}