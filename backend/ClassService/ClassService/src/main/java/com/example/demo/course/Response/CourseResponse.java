package com.example.demo.course.Response;

import com.example.demo.common.Response.BasicResponse;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private UUID courseId;
    private String courseName;
    private String courseCode;
    private String description;
    private Integer durationInYears;
    private Integer totalSemesters;
    private Boolean active;
}
