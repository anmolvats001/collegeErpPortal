package com.example.demo.Attendance.Response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {

    private UUID studentClassId;

    private UUID classSubjectId;

    private long totalClasses;

    private long present;

    private long absent;


    private double attendancePercentage;
}