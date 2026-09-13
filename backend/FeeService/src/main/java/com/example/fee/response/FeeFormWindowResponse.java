package com.example.fee.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record FeeFormWindowResponse(UUID id, String formName, LocalDateTime openAt, LocalDateTime closeAt,
                                    boolean active, String createdBy) {
}
