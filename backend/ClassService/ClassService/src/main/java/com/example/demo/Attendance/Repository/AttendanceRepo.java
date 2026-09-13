package com.example.demo.Attendance.Repository;

import com.example.demo.Attendance.Entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRepo
        extends JpaRepository<Attendance, UUID> {

    // Get attendance by ID within current college
    Optional<Attendance> findByIdAndCollegeId(
            UUID id,
            UUID collegeId
    );


    // Check whether attendance already exists
    // for a student in a particular session
    Optional<Attendance>
    findByAttendanceSession_IdAndStudentClass_Id(
            UUID sessionId,
            UUID studentClassId
    );


    // Get attendance records of a session
    List<Attendance>
    findByCollegeIdAndAttendanceSession_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
            UUID collegeId,
            UUID sessionId
    );


    // Get all attendance of a student
    // Sorted by date and then starting time
    List<Attendance>
    findByCollegeIdAndStudentClass_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
            UUID collegeId,
            UUID studentClassId
    );


    // Get student's attendance for a particular subject
    // Sorted by date and then starting time
    List<Attendance>
    findByCollegeIdAndStudentClass_IdAndAttendanceSession_TeacherSubject_ClassSubject_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
            UUID collegeId,
            UUID studentClassId,
            UUID classSubjectId
    );
}