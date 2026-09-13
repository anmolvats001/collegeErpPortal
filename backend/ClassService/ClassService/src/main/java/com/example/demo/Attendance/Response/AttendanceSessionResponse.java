package com.example.demo.Attendance.Response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSessionResponse {

    private UUID attendanceSessionId;

    private UUID teacherSubjectId;

    private UUID teacherId;

    private UUID classSubjectId;

    private UUID classId;

    private UUID subjectId;

    private String subjectName;

    private String className;

    private String section;

    private LocalDate attendanceDate;

    private LocalTime startTime;

    private LocalTime endTime;
}