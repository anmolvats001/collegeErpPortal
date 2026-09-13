package com.example.demo.Class.Request;

import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClassActiveRequest {
    private boolean active;
    private UUID classId;
}
