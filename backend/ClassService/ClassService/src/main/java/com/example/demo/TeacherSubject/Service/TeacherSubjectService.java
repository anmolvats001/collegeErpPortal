package com.example.demo.TeacherSubject.Service;

import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.ClassSubject.Repository.ClassSubjectRepo;
import com.example.demo.Teacher.Entity.Teacher;
import com.example.demo.Teacher.Repository.TeacherRepository;
import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import com.example.demo.TeacherSubject.Repository.TeacherSubjectRepo;
import com.example.demo.TeacherSubject.Request.TeacherSubjectActiveRequest;
import com.example.demo.TeacherSubject.Request.TeacherSubjectRequest;
import com.example.demo.TeacherSubject.Response.TeacherSubjectResponse;
import com.example.demo.common.context.CollegeContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherSubjectService {

    private final TeacherSubjectRepo teacherSubjectRepo;
    private final TeacherRepository teacherRepo;
    private final ClassSubjectRepo classSubjectRepo;

    public TeacherSubjectResponse createTeacherSubject(
            TeacherSubjectRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Teacher teacher = teacherRepo
                .findByIdAndCollegeId(
                        request.getTeacherId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        ClassSubject classSubject = classSubjectRepo
                .findByIdAndCollegeId(
                        request.getClassSubjectId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class subject not found"));

        boolean exists =
                teacherSubjectRepo
                        .existsByCollegeIdAndTeacher_IdAndClassSubject_Id(
                                collegeId,
                                request.getTeacherId(),
                                request.getClassSubjectId()
                        );

        if (exists) {
            throw new RuntimeException(
                    "Teacher is already assigned to this subject"
            );
        }

        TeacherSubject teacherSubject =
                TeacherSubject.builder()
                        .teacher(teacher)
                        .classSubject(classSubject)
                        .collegeId(collegeId)
                        .build();

        return createResponse(
                teacherSubjectRepo.save(teacherSubject)
        );
    }

    public TeacherSubjectResponse getTeacherSubject(
            UUID teacherSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        TeacherSubject teacherSubject =
                teacherSubjectRepo
                        .findByIdAndCollegeId(
                                teacherSubjectId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Teacher subject not found"));

        return createResponse(teacherSubject);
    }

    public List<TeacherSubjectResponse> getAllTeacherSubjects() {

        UUID collegeId = CollegeContext.getCollegeId();

        return teacherSubjectRepo
                .findByCollegeId(collegeId)
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<TeacherSubjectResponse> getSubjectsOfTeacher(
            UUID teacherId) {

        UUID collegeId = CollegeContext.getCollegeId();

        teacherRepo.findByIdAndCollegeId(
                        teacherId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        return teacherSubjectRepo
                .findByCollegeIdAndTeacher_Id(
                        collegeId,
                        teacherId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<TeacherSubjectResponse> getTeachersOfClassSubject(
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        classSubjectRepo.findByIdAndCollegeId(
                        classSubjectId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class subject not found"));

        return teacherSubjectRepo
                .findByCollegeIdAndClassSubject_Id(
                        collegeId,
                        classSubjectId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public TeacherSubjectResponse updateActiveStatus(
            TeacherSubjectActiveRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        TeacherSubject teacherSubject =
                teacherSubjectRepo
                        .findByIdAndCollegeId(
                                request.getTeacherSubjectId(),
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Teacher subject not found"));

        teacherSubject.setIsActive(request.getActive());

        return createResponse(
                teacherSubjectRepo.save(teacherSubject)
        );
    }

    public void deleteTeacherSubject(
            UUID teacherSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        TeacherSubject teacherSubject =
                teacherSubjectRepo
                        .findByIdAndCollegeId(
                                teacherSubjectId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Teacher subject not found"));

        teacherSubject.setIsDeleted(true);
        teacherSubject.setIsActive(false);

        teacherSubjectRepo.save(teacherSubject);
    }

    private TeacherSubjectResponse createResponse(
            TeacherSubject teacherSubject) {

        Teacher teacher = teacherSubject.getTeacher();
        ClassSubject classSubject =
                teacherSubject.getClassSubject();

        ClassEntity classEntity =
                classSubject.getClassEntity();

        var subject = classSubject.getSubject();

        return TeacherSubjectResponse.builder()
                .teacherSubjectId(teacherSubject.getId())

                .teacherId(teacher.getId())
                .teacherName(
                        teacher.getFirstName() + " " +
                                teacher.getLastName()
                )
                .employeeId(teacher.getEmployeeId())

                .classSubjectId(classSubject.getId())

                .classId(classEntity.getId())
                .className(classEntity.getClassName())
                .section(classEntity.getSection())

                .subjectId(subject.getId())
                .subjectName(subject.getSubjectName())
                .subjectCode(subject.getSubjectCode())
                .semester(subject.getSemester())

                .active(teacherSubject.getIsActive())
                .build();
    }
}