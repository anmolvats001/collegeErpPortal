package com.example.demo.Teacher.Service;

import com.example.demo.Teacher.Entity.Teacher;
import com.example.demo.Teacher.Request.TeacherActiveRequest;
import com.example.demo.Teacher.Request.TeacherRequest;
import com.example.demo.Teacher.Response.TeacherResponse;
import com.example.demo.common.context.CollegeContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherService {

    private final com.example.demo.Teacher.Repository.TeacherRepository teacherRepo;

    public TeacherResponse createTeacher(
            TeacherRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        if (teacherRepo.existsByCollegeIdAndEmployeeId(
                collegeId,
                request.getEmployeeId())) {

            throw new RuntimeException(
                    "Employee ID already exists"
            );
        }

        if (teacherRepo.existsByCollegeIdAndUserId(
                collegeId,
                request.getUserId())) {

            throw new RuntimeException(
                    "Teacher already exists for this user"
            );
        }

        Teacher teacher = Teacher.builder()
                .userId(request.getUserId())
                .employeeId(request.getEmployeeId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .designation(request.getDesignation())
                .department(request.getDepartment())
                .joiningDate(request.getJoiningDate())
                .qualification(request.getQualification())
                .collegeId(collegeId)
                .build();

        Teacher savedTeacher = teacherRepo.save(teacher);

        return createTeacherResponse(savedTeacher);
    }

    public TeacherResponse getTeacher(UUID teacherId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Teacher teacher = teacherRepo
                .findByIdAndCollegeId(
                        teacherId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Teacher not found"
                        ));

        return createTeacherResponse(teacher);
    }

    public TeacherResponse getTeacherByUserId(
            String userId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Teacher teacher = teacherRepo
                .findByUserIdAndCollegeId(
                        userId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Teacher not found"
                        ));

        return createTeacherResponse(teacher);
    }

    public List<TeacherResponse> getAllTeachers() {

        UUID collegeId = CollegeContext.getCollegeId();

        return teacherRepo
                .findByCollegeId(collegeId)
                .stream()
                .map(this::createTeacherResponse)
                .toList();
    }

    public List<TeacherResponse> searchTeachers(
            String name) {

        UUID collegeId = CollegeContext.getCollegeId();

        return teacherRepo
                .findByCollegeIdAndFirstNameContainingIgnoreCase(
                        collegeId,
                        name
                )
                .stream()
                .map(this::createTeacherResponse)
                .toList();
    }

    public TeacherResponse updateTeacher(
            UUID teacherId,
            TeacherRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Teacher teacher = teacherRepo
                .findByIdAndCollegeId(
                        teacherId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Teacher not found"
                        ));

        teacher.setEmployeeId(request.getEmployeeId());
        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhoneNumber(request.getPhoneNumber());
        teacher.setDesignation(request.getDesignation());
        teacher.setDepartment(request.getDepartment());
        teacher.setJoiningDate(request.getJoiningDate());
        teacher.setQualification(request.getQualification());

        return createTeacherResponse(
                teacherRepo.save(teacher)
        );
    }

    public TeacherResponse updateTeacherActiveStatus(
            TeacherActiveRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Teacher teacher = teacherRepo
                .findByIdAndCollegeId(
                        request.getTeacherId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Teacher not found"
                        ));

        teacher.setIsActive(request.getActive());

        return createTeacherResponse(
                teacherRepo.save(teacher)
        );
    }

    public void deleteTeacher(UUID teacherId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Teacher teacher = teacherRepo
                .findByIdAndCollegeId(
                        teacherId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Teacher not found"
                        ));

        teacher.setIsDeleted(true);
        teacher.setIsActive(false);

        teacherRepo.save(teacher);
    }

    private TeacherResponse createTeacherResponse(
            Teacher teacher) {

        return TeacherResponse.builder()
                .teacherId(teacher.getId())
                .userId(teacher.getUserId())
                .employeeId(teacher.getEmployeeId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getEmail())
                .phoneNumber(teacher.getPhoneNumber())
                .designation(teacher.getDesignation())
                .department(teacher.getDepartment())
                .joiningDate(teacher.getJoiningDate())
                .qualification(teacher.getQualification())
                .active(teacher.getIsActive())
                .build();
    }
}