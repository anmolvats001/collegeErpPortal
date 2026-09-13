package com.example.demo.Student.Service;

import com.example.demo.Student.Entity.Student;
import com.example.demo.Student.Repository.StudentRepo;
import com.example.demo.Student.Request.StudentActiveRequest;
import com.example.demo.Student.Request.StudentRequest;
import com.example.demo.Student.Response.StudentResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.notification.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepo studentRepo;
    private final NotificationProducer notificationProducer;

    public StudentResponse createStudent(
            StudentRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        if (studentRepo.existsByCollegeIdAndEnrollmentNumber(
                collegeId,
                request.getEnrollmentNumber())) {

            throw new RuntimeException(
                    "Enrollment number already exists"
            );
        }

        if (studentRepo.existsByCollegeIdAndUserId(
                collegeId,
                request.getUserId())) {

            throw new RuntimeException(
                    "Student already exists for this user"
            );
        }

        Student student = Student.builder()
                .userId(request.getUserId())
                .enrollmentNumber(request.getEnrollmentNumber())
                .rollNumber(request.getRollNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .profilePhoto(request.getProfilePhoto())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .guardianName(request.getGuardianName())
                .guardianPhoneNumber(
                        request.getGuardianPhoneNumber()
                )
                .address(request.getAddress())
                .admissionDate(request.getAdmissionDate())
                .collegeId(collegeId)
                .build();

        Student saved = studentRepo.save(student);
        notificationProducer.send(
                saved.getEmail(),
                "Campus Connect - Student Account Created",
                "Hello " + saved.getFirstName() + ",\n\nYour student profile has been created successfully.\nEnrollment Number: " + saved.getEnrollmentNumber() + "\n\nWelcome to Campus Connect."
        );
        return createStudentResponse(saved);
    }

    public StudentResponse getStudent(UUID studentId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Student student = studentRepo
                .findByIdAndCollegeId(
                        studentId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        return createStudentResponse(student);
    }

    public StudentResponse getStudentByUserId(
            String userId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Student student = studentRepo
                .findByUserIdAndCollegeId(
                        userId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        return createStudentResponse(student);
    }

    public List<StudentResponse> getAllStudents() {

        UUID collegeId = CollegeContext.getCollegeId();

        return studentRepo
                .findByCollegeId(collegeId)
                .stream()
                .map(this::createStudentResponse)
                .toList();
    }

    public List<StudentResponse> searchStudents(
            String name) {

        UUID collegeId = CollegeContext.getCollegeId();

        return studentRepo
                .findByCollegeIdAndFirstNameContainingIgnoreCase(
                        collegeId,
                        name
                )
                .stream()
                .map(this::createStudentResponse)
                .toList();
    }

    public StudentResponse updateStudent(
            UUID studentId,
            StudentRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Student student = studentRepo
                .findByIdAndCollegeId(
                        studentId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        student.setEnrollmentNumber(
                request.getEnrollmentNumber()
        );

        student.setRollNumber(
                request.getRollNumber()
        );

        student.setFirstName(
                request.getFirstName()
        );

        student.setLastName(
                request.getLastName()
        );

        student.setEmail(
                request.getEmail()
        );

        student.setPhoneNumber(
                request.getPhoneNumber()
        );

        student.setProfilePhoto(
                request.getProfilePhoto()
        );

        student.setDateOfBirth(
                request.getDateOfBirth()
        );

        student.setGender(
                request.getGender()
        );

        student.setBloodGroup(
                request.getBloodGroup()
        );

        student.setGuardianName(
                request.getGuardianName()
        );

        student.setGuardianPhoneNumber(
                request.getGuardianPhoneNumber()
        );

        student.setAddress(
                request.getAddress()
        );

        student.setAdmissionDate(
                request.getAdmissionDate()
        );

        return createStudentResponse(
                studentRepo.save(student)
        );
    }

    public StudentResponse updateStudentActiveStatus(
            StudentActiveRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Student student = studentRepo
                .findByIdAndCollegeId(
                        request.getStudentId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        student.setIsActive(request.getActive());

        return createStudentResponse(
                studentRepo.save(student)
        );
    }

    public void deleteStudent(UUID studentId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Student student = studentRepo
                .findByIdAndCollegeId(
                        studentId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        // Soft delete
        student.setIsDeleted(true);
        student.setIsActive(false);

        studentRepo.save(student);
    }

    private StudentResponse createStudentResponse(
            Student student) {

        return StudentResponse.builder()
                .studentId(student.getId())
                .userId(student.getUserId())
                .enrollmentNumber(
                        student.getEnrollmentNumber()
                )
                .rollNumber(student.getRollNumber())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .profilePhoto(student.getProfilePhoto())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .bloodGroup(student.getBloodGroup())
                .guardianName(student.getGuardianName())
                .guardianPhoneNumber(
                        student.getGuardianPhoneNumber()
                )
                .address(student.getAddress())
                .admissionDate(student.getAdmissionDate())
                .active(student.getIsActive())
                .build();
    }
}