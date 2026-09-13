package com.example.demo.Notice.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private LocalDateTime publishDate;

    private LocalDateTime expiryDate;
}