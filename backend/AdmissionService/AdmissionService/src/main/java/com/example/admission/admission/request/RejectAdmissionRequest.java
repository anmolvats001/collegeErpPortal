package com.example.admission.admission.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class RejectAdmissionRequest {
    @NotBlank
    @Size(max = 1000)
    private String reason;
}
