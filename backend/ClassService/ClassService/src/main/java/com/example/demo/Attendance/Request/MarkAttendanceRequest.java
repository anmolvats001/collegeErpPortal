package com.example.demo.Attendance.Request;

import com.example.demo.Attendance.Entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAttendanceRequest {

    @NotNull
    private UUID attendanceSessionId;

    @NotNull
    private UUID studentClassId;

    @NotNull
    private AttendanceStatus status;
}