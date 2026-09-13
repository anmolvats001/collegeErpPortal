package com.example.admission.admission.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class DocumentRequest {
    @NotBlank
    private String documentType;
    @NotBlank
    private String fileName;
    private String fileUrl;
}
