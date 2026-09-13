package com.example.demo.course.Request;

import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseActiveRequest {
    private UUID courseId;
    private boolean active;
}
