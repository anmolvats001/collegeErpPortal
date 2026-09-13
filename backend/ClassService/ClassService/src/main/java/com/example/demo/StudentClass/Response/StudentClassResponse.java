package com.example.demo.StudentClass.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassResponse {

    private UUID studentClassId;

    private UUID studentId;
    private String studentName;
    private String enrollmentNumber;

    private UUID classId;
    private String className;
    private String section;

    private UUID branchId;
    private String branchName;

    private Integer academicYear;
    private Integer semester;

    private String rollNumber;

    private Boolean active;
}