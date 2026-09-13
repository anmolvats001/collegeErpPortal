package com.example.demo.Attendance.Service;

import com.example.demo.Attendance.Entity.Attendance;
import com.example.demo.Attendance.Entity.AttendanceSession;
import com.example.demo.Attendance.Entity.AttendanceStatus;
import com.example.demo.Attendance.Repository.AttendanceRepo;
import com.example.demo.Attendance.Repository.AttendanceSessionRepo;
import com.example.demo.Attendance.Request.AttendanceSessionRequest;
import com.example.demo.Attendance.Request.BulkAttendanceRequest;
import com.example.demo.Attendance.Response.AttendanceResponse;
import com.example.demo.Attendance.Response.AttendanceSessionResponse;
import com.example.demo.Attendance.Response.AttendanceSummaryResponse;
import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.Student.Entity.Student;
import com.example.demo.Student.Repository.StudentRepo;
import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.StudentClass.Repository.StudentClassRepo;
import com.example.demo.Teacher.Entity.Teacher;
import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import com.example.demo.TeacherSubject.Repository.TeacherSubjectRepo;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepo attendanceRepo;
    private final AttendanceSessionRepo attendanceSessionRepo;
    private final TeacherSubjectRepo teacherSubjectRepo;
    private final StudentClassRepo studentClassRepo;
    private final StudentRepo studentRepo;
    private final com.example.demo.Teacher.Repository.TeacherRepository teacherRepo;
    // =========================
    // CREATE ATTENDANCE SESSION
    // =========================

    public AttendanceSessionResponse createSession(
            AttendanceSessionRequest request) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        if (request.getEndTime()
                .isBefore(request.getStartTime())
                ||
                request.getEndTime()
                        .equals(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        TeacherSubject teacherSubject =
                teacherSubjectRepo
                        .findByIdAndCollegeId(
                                request.getTeacherSubjectId(),
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Teacher subject not found"
                                ));
        if(!teacherSubject.getTeacher().getUserId().equals(UserContext.getUserId())){
            throw new RuntimeException("You are not allowed to create session for this class");
        }

        AttendanceSession session =
                AttendanceSession.builder()
                        .teacherSubject(teacherSubject)
                        .attendanceDate(
                                request.getAttendanceDate()
                        )
                        .startTime(
                                request.getStartTime()
                        )
                        .endTime(
                                request.getEndTime()
                        )
                        .collegeId(collegeId)
                        .build();

        return createSessionResponse(
                attendanceSessionRepo.save(session)
        );
    }


    // =========================
    // MARK BULK ATTENDANCE
    // =========================

    public List<AttendanceResponse> markBulkAttendance(
            BulkAttendanceRequest request) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        AttendanceSession session =
                attendanceSessionRepo
                        .findByIdAndCollegeId(
                                request.getAttendanceSessionId(),
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance session not found"
                                ));

        TeacherSubject teacherSubject =
                session.getTeacherSubject();

        ClassSubject classSubject =
                teacherSubject.getClassSubject();

        List<Attendance> attendanceList =
                request.getStudents()
                        .stream()
                        .map(studentRequest -> {

                            StudentClass studentClass =
                                    studentClassRepo
                                            .findByIdAndCollegeId(
                                                    studentRequest
                                                            .getStudentClassId(),
                                                    collegeId
                                            )
                                            .orElseThrow(() ->
                                                    new RuntimeException(
                                                            "Student class not found"
                                                    ));

                            /*
                             * Student must belong
                             * to the same class.
                             */

                            if (!studentClass
                                    .getClassEntity()
                                    .getId()
                                    .equals(
                                            classSubject
                                                    .getClassEntity()
                                                    .getId()
                                    )) {

                                throw new RuntimeException(
                                        "Student does not belong to this class"
                                );
                            }

                            Attendance attendance =
                                    attendanceRepo
                                            .findByAttendanceSession_IdAndStudentClass_Id(
                                                    session.getId(),
                                                    studentClass.getId()
                                            )
                                            .orElse(
                                                    Attendance.builder()
                                                            .attendanceSession(
                                                                    session
                                                            )
                                                            .studentClass(
                                                                    studentClass
                                                            )
                                                            .collegeId(
                                                                    collegeId
                                                            )
                                                            .build()
                                            );

                            attendance.setStatus(
                                    studentRequest
                                            .getStatus()
                            );

                            return attendance;

                        })
                        .toList();

        return attendanceRepo
                .saveAll(attendanceList)
                .stream()
                .map(this::createAttendanceResponse)
                .toList();
    }


    // =========================
    // GET SESSION
    // =========================

    public AttendanceSessionResponse getSession(
            UUID sessionId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        AttendanceSession session =
                attendanceSessionRepo
                        .findByIdAndCollegeId(
                                sessionId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance session not found"
                                ));

        return createSessionResponse(session);
    }


    // =========================
    // GET SESSION ATTENDANCE
    // =========================

    public List<AttendanceResponse>
    getAttendanceOfSession(UUID sessionId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        attendanceSessionRepo
                .findByIdAndCollegeId(
                        sessionId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Attendance session not found"
                        ));

        return attendanceRepo
                .findByCollegeIdAndAttendanceSession_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
                        collegeId,
                        sessionId
                )
                .stream()
                .map(this::createAttendanceResponse)
                .toList();
    }


    // =========================
    // STUDENT ATTENDANCE
    // =========================

    public List<AttendanceResponse>
    getStudentAttendance(
            UUID studentClassId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        studentClassRepo
                .findByIdAndCollegeId(
                        studentClassId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student class not found"
                        ));

        return attendanceRepo
                .findByCollegeIdAndStudentClass_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
                        collegeId,
                        studentClassId
                )
                .stream()
                .map(this::createAttendanceResponse)
                .toList();
    }
    public List<AttendanceResponse> getStudentAttendanceOfSubject(
            UUID studentClassId,
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return attendanceRepo
                .findByCollegeIdAndStudentClass_IdAndAttendanceSession_TeacherSubject_ClassSubject_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
                        collegeId,
                        studentClassId,
                        classSubjectId
                )
                .stream()
                .map(this::createAttendanceResponse)
                .toList();
    }
    public List<AttendanceSessionResponse> getMySessions() {

        UUID collegeId = CollegeContext.getCollegeId();
        String userId = UserContext.getUserId();

        return attendanceSessionRepo
                .findByCollegeIdAndTeacherSubject_Teacher_UserIdOrderByAttendanceDateAscStartTimeAsc(
                        collegeId,
                        userId
                )
                .stream()
                .map(this::createSessionResponse)
                .toList();
    }
    public List<AttendanceSessionResponse>
    getSubjectSessions(UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return attendanceSessionRepo
                .findByCollegeIdAndTeacherSubject_ClassSubject_IdOrderByAttendanceDateAscStartTimeAsc(
                        collegeId,
                        classSubjectId
                )
                .stream()
                .map(this::createSessionResponse)
                .toList();
    }
    public List<AttendanceResponse> getMyAttendance() {

        UUID collegeId = CollegeContext.getCollegeId();
        String userId = UserContext.getUserId();

        Student student = studentRepo
                .findByUserIdAndCollegeId(userId, collegeId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );

        StudentClass studentClass = studentClassRepo
                .findByStudent_IdAndCollegeId(
                        student.getId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Student class not found")
                );

        return attendanceRepo
                .findByCollegeIdAndStudentClass_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
                        collegeId,
                        studentClass.getId()
                )
                .stream()
                .map(this::createAttendanceResponse)
                .toList();
    }
    // =========================
    // DATE-WISE SESSIONS
    // =========================

    public List<AttendanceSessionResponse>
    getSessionsByDate(LocalDate date) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        return attendanceSessionRepo
                .findByCollegeIdAndAttendanceDateOrderByStartTimeAsc(
                        collegeId,
                        date
                )
                .stream()
                .map(this::createSessionResponse)
                .toList();
    }


    // =========================
    // UPDATE ATTENDANCE
    // =========================

    public AttendanceResponse updateAttendance(
            UUID attendanceId,
            com.example.demo.Attendance.Entity.AttendanceStatus status) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        Attendance attendance =
                attendanceRepo
                        .findByIdAndCollegeId(
                                attendanceId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found"
                                ));

        attendance.setStatus(status);

        return createAttendanceResponse(
                attendanceRepo.save(attendance)
        );
    }
    public List<AttendanceSessionResponse> getMySessionsByDate(
            LocalDate date) {

        UUID collegeId = CollegeContext.getCollegeId();
        String userId = UserContext.getUserId();

        Teacher teacher = teacherRepo
                .findByUserIdAndCollegeId(userId, collegeId)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found")
                );

        return attendanceSessionRepo
                .findByCollegeIdAndTeacherSubject_Teacher_IdAndAttendanceDateOrderByStartTimeAsc(
                        collegeId,
                        teacher.getId(),
                        date
                )
                .stream()
                .map(this::createSessionResponse)
                .toList();
    }
    public AttendanceSummaryResponse getAttendanceSummary(
            UUID studentClassId,
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        List<Attendance> attendanceList =
                attendanceRepo
                        .findByCollegeIdAndStudentClass_IdAndAttendanceSession_TeacherSubject_ClassSubject_IdOrderByAttendanceSession_AttendanceDateAscAttendanceSession_StartTimeAsc(
                                collegeId,
                                studentClassId,
                                classSubjectId
                        );

        long totalClasses = attendanceList.size();

        long present = attendanceList.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();

        long absent = attendanceList.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .count();
        double percentage = totalClasses == 0
                ? 0
                : ((double) present / totalClasses) * 100;

        return AttendanceSummaryResponse.builder()
                .studentClassId(studentClassId)
                .classSubjectId(classSubjectId)
                .totalClasses(totalClasses)
                .present(present)
                .absent(absent)
                .attendancePercentage(percentage)
                .build();
    }
    // =========================
    // RESPONSE
    // =========================

    private AttendanceSessionResponse
    createSessionResponse(
            AttendanceSession session) {

        TeacherSubject teacherSubject =
                session.getTeacherSubject();

        ClassSubject classSubject =
                teacherSubject.getClassSubject();

        return AttendanceSessionResponse.builder()
                .attendanceSessionId(
                        session.getId()
                )
                .teacherSubjectId(
                        teacherSubject.getId()
                )
                .teacherId(
                        teacherSubject
                                .getTeacher()
                                .getId()
                )
                .classSubjectId(
                        classSubject.getId()
                )
                .classId(
                        classSubject
                                .getClassEntity()
                                .getId()
                )
                .subjectId(
                        classSubject
                                .getSubject()
                                .getId()
                )
                .subjectName(
                        classSubject
                                .getSubject()
                                .getSubjectName()
                )
                .className(
                        classSubject
                                .getClassEntity()
                                .getClassName()
                )
                .section(
                        classSubject
                                .getClassEntity()
                                .getSection()
                )
                .attendanceDate(
                        session.getAttendanceDate()
                )
                .startTime(
                        session.getStartTime()
                )
                .endTime(
                        session.getEndTime()
                )
                .build();
    }


    private AttendanceResponse
    createAttendanceResponse(
            Attendance attendance) {

        StudentClass studentClass =
                attendance.getStudentClass();

        AttendanceSession session =
                attendance.getAttendanceSession();

        ClassSubject classSubject =
                session.getTeacherSubject()
                        .getClassSubject();

        return AttendanceResponse.builder()
                .attendanceId(
                        attendance.getId()
                )
                .attendanceSessionId(
                        session.getId()
                )
                .studentClassId(
                        studentClass.getId()
                )
                .studentId(
                        studentClass
                                .getStudent()
                                .getId()
                )
                .studentName(
                        studentClass
                                .getStudent()
                                .getFirstName()
                                + " " +
                                studentClass
                                        .getStudent()
                                        .getLastName()
                )
                .rollNumber(
                        studentClass.getRollNumber()
                )
                .classSubjectId(
                        classSubject.getId()
                )
                .subjectName(
                        classSubject
                                .getSubject()
                                .getSubjectName()
                )
                .attendanceDate(
                        session.getAttendanceDate()
                )
                .startTime(
                        session.getStartTime()
                )
                .endTime(
                        session.getEndTime()
                )
                .status(
                        attendance.getStatus()
                )
                .build();
    }
}