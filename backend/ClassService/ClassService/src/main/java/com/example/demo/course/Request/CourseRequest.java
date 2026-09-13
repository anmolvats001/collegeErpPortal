package com.example.demo.course.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CourseRequest {
    @NotBlank(message = "Course Name can't be blank")
    private String courseName;
    @NotNull(message = "Course Code can't be null")
    private String courseCode;
    private String description;
    @NotNull(message = "Duration can't be null")
    private Integer durationInYears;
    @NotNull(message = "Number of Semesters can't be null")
    private Integer totalSemesters;
}
