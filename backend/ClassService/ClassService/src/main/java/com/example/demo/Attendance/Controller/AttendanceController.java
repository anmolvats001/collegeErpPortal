package com.example.demo.Attendance.Controller;

import com.example.demo.Attendance.Entity.AttendanceStatus;
import com.example.demo.Attendance.Request.AttendanceSessionRequest;
import com.example.demo.Attendance.Request.BulkAttendanceRequest;
import com.example.demo.Attendance.Response.AttendanceResponse;
import com.example.demo.Attendance.Response.AttendanceSessionResponse;
import com.example.demo.Attendance.Response.AttendanceSummaryResponse;
import com.example.demo.Attendance.Service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/class/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;


    // =========================================================
    //                    SESSION ENDPOINTS
    // =========================================================

    // CREATE SESSION
    @PostMapping("/session")
    @PreAuthorize("hasAuthority('CREATE_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<AttendanceSessionResponse> createSession(
            @Valid @RequestBody AttendanceSessionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attendanceService.createSession(request));
    }


    // GET SESSION BY ID
    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<AttendanceSessionResponse> getSession(
            @PathVariable UUID sessionId) {

        return ResponseEntity.ok(
                attendanceService.getSession(sessionId)
        );
    }


    // GET MY SESSIONS
    @GetMapping("/session/my")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceSessionResponse>> getMySessions() {

        return ResponseEntity.ok(
                attendanceService.getMySessions()
        );
    }


    // GET MY SESSIONS BY DATE
    @GetMapping("/session/my/date/{date}")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceSessionResponse>> getMySessionsByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                attendanceService.getMySessionsByDate(date)
        );
    }


    // GET ALL SESSIONS OF A SUBJECT
    @GetMapping("/session/subject/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceSessionResponse>> getSubjectSessions(
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                attendanceService.getSubjectSessions(classSubjectId)
        );
    }


    // GET ALL SESSIONS BY DATE
    @GetMapping("/session/date/{date}")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceSessionResponse>> getSessionsByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                attendanceService.getSessionsByDate(date)
        );
    }


    // =========================================================
    //                    ATTENDANCE ENDPOINTS
    // =========================================================

    // MARK BULK ATTENDANCE
    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('CREATE_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceResponse>> markBulkAttendance(
            @Valid @RequestBody BulkAttendanceRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attendanceService.markBulkAttendance(request));
    }


    // GET ATTENDANCE RECORDS OF A SESSION
    @GetMapping("/session/{sessionId}/records")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceOfSession(
            @PathVariable UUID sessionId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceOfSession(sessionId)
        );
    }


    // GET MY ATTENDANCE
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance() {

        return ResponseEntity.ok(
                attendanceService.getMyAttendance()
        );
    }


    // GET STUDENT COMPLETE ATTENDANCE
    @GetMapping("/student/{studentClassId}")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceResponse>> getStudentAttendance(
            @PathVariable UUID studentClassId) {

        return ResponseEntity.ok(
                attendanceService.getStudentAttendance(studentClassId)
        );
    }


    // GET STUDENT ATTENDANCE OF A SUBJECT
    @GetMapping("/student/{studentClassId}/subject/{classSubjectId}")
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<List<AttendanceResponse>> getStudentAttendanceOfSubject(
            @PathVariable UUID studentClassId,
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                attendanceService.getStudentAttendanceOfSubject(
                        studentClassId,
                        classSubjectId
                )
        );
    }


    // GET ATTENDANCE SUMMARY
    @GetMapping(
            "/student/{studentClassId}/subject/{classSubjectId}/summary"
    )
    @PreAuthorize("hasAuthority('GET_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<AttendanceSummaryResponse> getAttendanceSummary(
            @PathVariable UUID studentClassId,
            @PathVariable UUID classSubjectId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceSummary(
                        studentClassId,
                        classSubjectId
                )
        );
    }


    // UPDATE ATTENDANCE
    @PatchMapping("/{attendanceId}")
    @PreAuthorize("hasAuthority('UPDATE_ATTENDANCE') and hasAuthority('MODULE_ATTENDANCE')")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable UUID attendanceId,
            @RequestParam AttendanceStatus status) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(
                        attendanceId,
                        status
                )
        );
    }
}