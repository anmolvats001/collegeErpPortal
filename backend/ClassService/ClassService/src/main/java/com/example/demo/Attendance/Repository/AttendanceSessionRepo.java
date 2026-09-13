package com.example.demo.Attendance.Repository;

import com.example.demo.Attendance.Entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceSessionRepo
        extends JpaRepository<AttendanceSession, UUID> {

    // Get one session of the college
    Optional<AttendanceSession> findByIdAndCollegeId(
            UUID id,
            UUID collegeId
    );

    // Get all sessions of college
    List<AttendanceSession>
    findByCollegeIdOrderByAttendanceDateAscStartTimeAsc(
            UUID collegeId
    );

    // Get sessions of a particular TeacherSubject
    List<AttendanceSession>
    findByCollegeIdAndTeacherSubject_IdOrderByAttendanceDateAscStartTimeAsc(
            UUID collegeId,
            UUID teacherSubjectId
    );

    // Get sessions on a particular date
    List<AttendanceSession>
    findByCollegeIdAndAttendanceDateOrderByStartTimeAsc(
            UUID collegeId,
            LocalDate date
    );

    // Get sessions of logged-in teacher
    List<AttendanceSession>
    findByCollegeIdAndTeacherSubject_Teacher_UserIdOrderByAttendanceDateAscStartTimeAsc(
            UUID collegeId,
            String userId
    );

    // Get sessions of a particular subject
    List<AttendanceSession>
    findByCollegeIdAndTeacherSubject_ClassSubject_IdOrderByAttendanceDateAscStartTimeAsc(
            UUID collegeId,
            UUID classSubjectId
    );

    // Get sessions of a teacher on a particular date
    List<AttendanceSession>
    findByCollegeIdAndTeacherSubject_Teacher_IdAndAttendanceDateOrderByStartTimeAsc(
            UUID collegeId,
            UUID teacherId,
            LocalDate date
    );
}