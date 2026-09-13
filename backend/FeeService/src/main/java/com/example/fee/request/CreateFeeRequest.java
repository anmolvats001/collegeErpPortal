package com.example.fee.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateFeeRequest(@NotBlank String studentUserId, String studentName, UUID courseId, String courseName,
                               UUID branchId, String branchName, @NotNull @DecimalMin("0.00") BigDecimal totalFee) {
}
