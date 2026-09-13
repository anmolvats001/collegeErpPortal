package com.example.demo.Subject.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {

    private UUID subjectId;

    private String subjectName;

    private String subjectCode;

    private String description;

    private Integer credits;

    private Integer semester;

    private UUID courseId;

    private Boolean active;
}