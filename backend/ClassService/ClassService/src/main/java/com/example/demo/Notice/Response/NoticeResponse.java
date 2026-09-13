package com.example.demo.Notice.Response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeResponse {

    private UUID noticeId;

    private String title;

    private String description;

    private LocalDateTime publishDate;

    private LocalDateTime expiryDate;

    private Boolean active;
}