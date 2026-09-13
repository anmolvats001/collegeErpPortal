package com.example.fee.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdateFeeRequest(@NotNull @DecimalMin("0.00") BigDecimal totalFee) {
}
