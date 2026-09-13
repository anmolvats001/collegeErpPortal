package com.example.fee.response;

import com.example.fee.entity.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public record FeePaymentResponse(UUID id, String studentUserId, BigDecimal amount, PaymentMethod paymentMethod,
                                 String transactionIds, List<String> proofImages, String remarks, PaymentStatus status,
                                 LocalDateTime submittedAt, LocalDateTime reviewedAt, String reviewedBy,
                                 String rejectionReason) {
}
