package com.example.fee.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record FeeFormStatusResponse(boolean open, UUID windowId, String formName, LocalDateTime openAt,
                                    LocalDateTime closeAt) {
}
