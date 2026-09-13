package com.example.demo.TeacherSubject.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSubjectResponse {

    private UUID teacherSubjectId;

    private UUID teacherId;
    private String teacherName;
    private String employeeId;

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