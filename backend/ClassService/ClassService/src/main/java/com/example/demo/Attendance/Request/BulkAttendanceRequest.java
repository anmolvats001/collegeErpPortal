package com.example.demo.Attendance.Request;

import com.example.demo.Attendance.Entity.AttendanceStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkAttendanceRequest {

    @NotNull
    private UUID attendanceSessionId;

    @Valid
    @NotNull
    private List<StudentAttendance> students;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentAttendance {

        @NotNull
        private UUID studentClassId;

        @NotNull
        private AttendanceStatus status;
    }
}