package com.example.demo.Attendance.Response;

import com.example.demo.Attendance.Entity.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private UUID attendanceId;

    private UUID attendanceSessionId;

    private UUID studentClassId;

    private UUID studentId;

    private String studentName;

    private String rollNumber;

    private UUID classSubjectId;

    private String subjectName;

    private LocalDate attendanceDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private AttendanceStatus status;
}