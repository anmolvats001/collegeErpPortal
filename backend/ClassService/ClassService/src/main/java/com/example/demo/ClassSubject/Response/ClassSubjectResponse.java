package com.example.demo.ClassSubject.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSubjectResponse {

    private UUID classSubjectId;

    private UUID classId;

    private String className;

    private String section;

    private UUID subjectId;

    private String subjectName;

    private String subjectCode;

    private Integer semester;

    private Boolean active;
}