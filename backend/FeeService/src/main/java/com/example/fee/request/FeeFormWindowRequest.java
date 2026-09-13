package com.example.fee.request;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record FeeFormWindowRequest(@NotBlank String formName, @NotNull LocalDateTime openAt,
                                   @NotNull LocalDateTime closeAt, boolean active) {
    public FeeFormWindowRequest {
        if (openAt != null && closeAt != null && !closeAt.isAfter(openAt))
            throw new IllegalArgumentException("closeAt must be after openAt");
    }
}
