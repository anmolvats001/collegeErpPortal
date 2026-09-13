package com.example.fee.response;

import com.example.fee.entity.FeeStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record FeeResponse(UUID id, UUID collegeId, String studentUserId, String studentName, UUID courseId,
                          String courseName, UUID branchId, String branchName, BigDecimal totalFee,
                          BigDecimal paidAmount, BigDecimal remainingAmount, FeeStatus status) {
}
