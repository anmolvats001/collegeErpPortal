package com.example.fee.request;

import com.example.fee.entity.PaymentMethod;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record PaymentFormRequest(@NotNull @DecimalMin("0.01") BigDecimal amount, @NotNull PaymentMethod paymentMethod,
                                 @NotBlank String transactionIds, @NotEmpty List<@NotBlank String> proofImages,
                                 String remarks, String email) {
}
