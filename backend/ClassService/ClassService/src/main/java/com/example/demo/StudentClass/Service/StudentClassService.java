package com.example.demo.StudentClass.Service;

import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Class.Repository.ClassRepo;
import com.example.demo.Student.Entity.Student;
import com.example.demo.Student.Repository.StudentRepo;
import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.StudentClass.Repository.StudentClassRepo;
import com.example.demo.StudentClass.Request.StudentClassActiveRequest;
import com.example.demo.StudentClass.Request.StudentClassRequest;
import com.example.demo.StudentClass.Response.StudentClassResponse;
import com.example.demo.common.context.CollegeContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentClassService {

    private final StudentClassRepo studentClassRepo;
    private final StudentRepo studentRepo;
    private final ClassRepo classRepo;

    public StudentClassResponse createStudentClass(
            StudentClassRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        // Check student
        Student student = studentRepo
                .findByIdAndCollegeId(
                        request.getStudentId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        // Check class
        ClassEntity classEntity = classRepo
                .findByIdAndCollegeId(
                        request.getClassId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class not found"
                        ));

        // Prevent duplicate enrollment
        boolean exists =
                studentClassRepo
                        .existsByCollegeIdAndStudent_IdAndClassEntity_IdAndAcademicYearAndSemester(
                                collegeId,
                                request.getStudentId(),
                                request.getClassId(),
                                request.getAcademicYear(),
                                request.getSemester()
                        );

        if (exists) {
            throw new RuntimeException(
                    "Student is already assigned to this class"
            );
        }

        StudentClass studentClass =
                StudentClass.builder()
                        .student(student)
                        .classEntity(classEntity)
                        .academicYear(
                                request.getAcademicYear()
                        )
                        .semester(
                                request.getSemester()
                        )
                        .rollNumber(
                                request.getRollNumber()
                        )
                        .collegeId(collegeId)
                        .build();

        return createResponse(
                studentClassRepo.save(studentClass)
        );
    }

    public StudentClassResponse getStudentClass(
            UUID studentClassId) {

        UUID collegeId = CollegeContext.getCollegeId();

        StudentClass studentClass =
                studentClassRepo
                        .findByIdAndCollegeId(
                                studentClassId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student class not found"
                                ));

        return createResponse(studentClass);
    }

    public List<StudentClassResponse> getAllStudentClasses() {

        UUID collegeId = CollegeContext.getCollegeId();

        return studentClassRepo
                .findByCollegeId(collegeId)
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<StudentClassResponse> getClassesOfStudent(
            UUID studentId) {

        UUID collegeId = CollegeContext.getCollegeId();

        studentRepo.findByIdAndCollegeId(
                        studentId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        return studentClassRepo
                .findByCollegeIdAndStudent_Id(
                        collegeId,
                        studentId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<StudentClassResponse> getStudentsOfClass(
            UUID classId) {

        UUID collegeId = CollegeContext.getCollegeId();

        classRepo.findByIdAndCollegeId(
                        classId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class not found"
                        ));

        return studentClassRepo
                .findByCollegeIdAndClassEntity_Id(
                        collegeId,
                        classId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<StudentClassResponse> getStudentsOfClassAndSemester(
            UUID classId,
            Integer semester) {

        UUID collegeId = CollegeContext.getCollegeId();

        classRepo.findByIdAndCollegeId(
                        classId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class not found"
                        ));

        return studentClassRepo
                .findByCollegeIdAndClassEntity_IdAndSemester(
                        collegeId,
                        classId,
                        semester
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public StudentClassResponse updateStudentClass(
            UUID studentClassId,
            StudentClassRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        StudentClass studentClass =
                studentClassRepo
                        .findByIdAndCollegeId(
                                studentClassId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student class not found"
                                ));

        Student student = studentRepo
                .findByIdAndCollegeId(
                        request.getStudentId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        ClassEntity classEntity = classRepo
                .findByIdAndCollegeId(
                        request.getClassId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class not found"
                        ));

        studentClass.setStudent(student);
        studentClass.setClassEntity(classEntity);
        studentClass.setAcademicYear(
                request.getAcademicYear()
        );
        studentClass.setSemester(
                request.getSemester()
        );
        studentClass.setRollNumber(
                request.getRollNumber()
        );

        return createResponse(
                studentClassRepo.save(studentClass)
        );
    }

    public StudentClassResponse updateActiveStatus(
            StudentClassActiveRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        StudentClass studentClass =
                studentClassRepo
                        .findByIdAndCollegeId(
                                request.getStudentClassId(),
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student class not found"
                                ));

        studentClass.setIsActive(
                request.getActive()
        );

        return createResponse(
                studentClassRepo.save(studentClass)
        );
    }

    public void deleteStudentClass(
            UUID studentClassId) {

        UUID collegeId = CollegeContext.getCollegeId();

        StudentClass studentClass =
                studentClassRepo
                        .findByIdAndCollegeId(
                                studentClassId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student class not found"
                                ));

        // Soft delete
        studentClass.setIsDeleted(true);
        studentClass.setIsActive(false);

        studentClassRepo.save(studentClass);
    }

    private StudentClassResponse createResponse(
            StudentClass studentClass) {

        Student student =
                studentClass.getStudent();

        ClassEntity classEntity =
                studentClass.getClassEntity();

        return StudentClassResponse.builder()

                .studentClassId(
                        studentClass.getId()
                )

                .studentId(
                        student.getId()
                )

                .studentName(
                        student.getFirstName() + " " +
                                student.getLastName()
                )

                .enrollmentNumber(
                        student.getEnrollmentNumber()
                )

                .classId(
                        classEntity.getId()
                )

                .className(
                        classEntity.getClassName()
                )

                .section(
                        classEntity.getSection()
                )

                .branchId(
                        classEntity.getBranch().getId()
                )

                .branchName(
                        classEntity.getBranch().getBranchName()
                )

                .academicYear(
                        studentClass.getAcademicYear()
                )

                .semester(
                        studentClass.getSemester()
                )

                .rollNumber(
                        studentClass.getRollNumber()
                )

                .active(
                        studentClass.getIsActive()
                )

                .build();
    }
}