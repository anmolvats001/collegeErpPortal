package com.example.fee.request;

import jakarta.validation.constraints.NotBlank;

public record RejectFeeFormRequest(@NotBlank String rejectionReason) {
}
