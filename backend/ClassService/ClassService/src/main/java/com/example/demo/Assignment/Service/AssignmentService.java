package com.example.demo.Assignment.Service;

import com.example.demo.Assignment.Entity.Assignment;
import com.example.demo.Assignment.Entity.StudentAssignment;
import com.example.demo.Assignment.Repository.AssignmentRepo;
import com.example.demo.Assignment.Repository.StudentAssignmentRepo;
import com.example.demo.Assignment.Request.AssignmentMarkRequest;
import com.example.demo.Assignment.Request.AssignmentRequest;
import com.example.demo.Assignment.Request.BulkAssignmentMarkRequest;
import com.example.demo.Assignment.Response.AssignmentResponse;
import com.example.demo.Assignment.Response.StudentAssignmentResponse;
import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.ClassSubject.Repository.ClassSubjectRepo;
import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.StudentClass.Repository.StudentClassRepo;
import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import com.example.demo.TeacherSubject.Repository.TeacherSubjectRepo;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepo assignmentRepo;
    private final StudentAssignmentRepo studentAssignmentRepo;

    private final ClassSubjectRepo classSubjectRepo;
    private final TeacherSubjectRepo teacherSubjectRepo;
    private final StudentClassRepo studentClassRepo;


    // =========================================================
    // CREATE ASSIGNMENT
    // =========================================================

    @Transactional
    public AssignmentResponse createAssignment(
            AssignmentRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        ClassSubject classSubject =
                classSubjectRepo
                        .findById(request.getClassSubjectId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "ClassSubject not found"
                                )
                        );

        TeacherSubject teacherSubject =
                teacherSubjectRepo
                        .findById(request.getTeacherSubjectId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "TeacherSubject not found"
                                )
                        );

        // Make sure both belong to current college
        if (!collegeId.equals(classSubject.getCollegeId())) {
            throw new RuntimeException(
                    "You are not authorized to use this ClassSubject"
            );
        }

        if (!collegeId.equals(teacherSubject.getCollegeId())) {
            throw new RuntimeException(
                    "You are not authorized to use this TeacherSubject"
            );
        }

        Assignment assignment = Assignment.builder()
                .assignmentName(request.getAssignmentName())
                .description(request.getDescription())
                .maxMarks(request.getMaxMarks())
                .classSubject(classSubject)
                .teacherSubject(teacherSubject)
                .collegeId(collegeId)
                .createdBy(UserContext.getUserId())
                .updatedBy(UserContext.getUserId())
                .build();

        return createAssignmentResponse(
                assignmentRepo.save(assignment)
        );
    }


    // =========================================================
    // GET ASSIGNMENT
    // =========================================================

    public AssignmentResponse getAssignment(
            UUID assignmentId) {

        Assignment assignment =
                assignmentRepo
                        .findById(assignmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assignment not found"
                                )
                        );

        checkCollege(assignment.getCollegeId());

        return createAssignmentResponse(assignment);
    }


    // =========================================================
    // GET ASSIGNMENTS OF CLASS SUBJECT
    // =========================================================

    public List<AssignmentResponse>
    getAssignmentsOfClassSubject(
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return assignmentRepo
                .findByCollegeIdAndClassSubject_IdOrderByCreatedAtAsc(
                        collegeId,
                        classSubjectId
                )
                .stream()
                .map(this::createAssignmentResponse)
                .toList();
    }


    // =========================================================
    // GET ASSIGNMENTS OF TEACHER SUBJECT
    // =========================================================

    public List<AssignmentResponse>
    getAssignmentsOfTeacherSubject(
            UUID teacherSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return assignmentRepo
                .findByCollegeIdAndTeacherSubject_IdOrderByCreatedAtAsc(
                        collegeId,
                        teacherSubjectId
                )
                .stream()
                .map(this::createAssignmentResponse)
                .toList();
    }


    // =========================================================
    // MARK ONE STUDENT
    // =========================================================

    @Transactional
    public StudentAssignmentResponse markAssignment(
            AssignmentMarkRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Assignment assignment =
                assignmentRepo
                        .findById(request.getAssignmentId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assignment not found"
                                )
                        );

        checkCollege(assignment.getCollegeId());

        validateMarks(
                request.getMarks(),
                assignment.getMaxMarks()
        );

        StudentClass studentClass =
                studentClassRepo
                        .findById(request.getStudentClassId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "StudentClass not found"
                                )
                        );

        checkCollege(studentClass.getCollegeId());

        // Make sure student belongs to the same class subject
        // before giving assignment marks.
        validateStudentBelongsToAssignment(
                studentClass,
                assignment
        );

        StudentAssignment studentAssignment =
                studentAssignmentRepo
                        .findByCollegeIdAndAssignment_IdAndStudentClass_Id(
                                collegeId,
                                assignment.getId(),
                                studentClass.getId()
                        )
                        .orElseGet(() ->
                                StudentAssignment.builder()
                                        .assignment(assignment)
                                        .studentClass(studentClass)
                                        .collegeId(collegeId)
                                        .build()
                        );

        studentAssignment.setMarks(request.getMarks());
        studentAssignment.setUpdatedBy(UserContext.getUserId());

        return createStudentAssignmentResponse(
                studentAssignmentRepo.save(studentAssignment)
        );
    }


    // =========================================================
    // BULK MARK
    // =========================================================

    @Transactional
    public List<StudentAssignmentResponse>
    bulkMarkAssignment(
            BulkAssignmentMarkRequest request) {

        return request.getMarks()
                .stream()
                .map(this::markAssignment)
                .toList();
    }


    // =========================================================
    // GET MARKS OF ASSIGNMENT
    // =========================================================

    public List<StudentAssignmentResponse>
    getAssignmentMarks(UUID assignmentId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return studentAssignmentRepo
                .findByCollegeIdAndAssignment_Id(
                        collegeId,
                        assignmentId
                )
                .stream()
                .map(this::createStudentAssignmentResponse)
                .toList();
    }


    // =========================================================
    // GET STUDENT ASSIGNMENTS
    // =========================================================

    public List<StudentAssignmentResponse>
    getStudentAssignments(
            UUID studentClassId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return studentAssignmentRepo
                .findByCollegeIdAndStudentClass_Id(
                        collegeId,
                        studentClassId
                )
                .stream()
                .map(this::createStudentAssignmentResponse)
                .toList();
    }


    // =========================================================
    // GET STUDENT ASSIGNMENTS OF CLASS SUBJECT
    // =========================================================

    public List<StudentAssignmentResponse>
    getStudentSubjectAssignments(
            UUID studentClassId,
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return studentAssignmentRepo
                .findByCollegeIdAndStudentClass_IdAndAssignment_ClassSubject_Id(
                        collegeId,
                        studentClassId,
                        classSubjectId
                )
                .stream()
                .map(this::createStudentAssignmentResponse)
                .toList();
    }


    // =========================================================
    // UPDATE MARKS
    // =========================================================

    @Transactional
    public StudentAssignmentResponse updateMarks(
            UUID studentAssignmentId,
            Integer marks) {

        UUID collegeId = CollegeContext.getCollegeId();

        StudentAssignment studentAssignment =
                studentAssignmentRepo
                        .findById(studentAssignmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student assignment not found"
                                )
                        );

        checkCollege(studentAssignment.getCollegeId());

        validateMarks(
                marks,
                studentAssignment
                        .getAssignment()
                        .getMaxMarks()
        );

        studentAssignment.setMarks(marks);
        studentAssignment.setUpdatedBy(
                UserContext.getUserId()
        );

        return createStudentAssignmentResponse(
                studentAssignmentRepo.save(studentAssignment)
        );
    }


    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateMarks(
            Integer marks,
            Integer maxMarks) {

        if (marks == null || marks < 0 || marks > maxMarks) {
            throw new RuntimeException(
                    "Marks must be between 0 and " + maxMarks
            );
        }
    }


    private void checkCollege(UUID entityCollegeId) {

        if (!CollegeContext
                .getCollegeId()
                .equals(entityCollegeId)) {

            throw new RuntimeException(
                    "You are not authorized to perform this operation"
            );
        }
    }


    private void validateStudentBelongsToAssignment(
            StudentClass studentClass,
            Assignment assignment) {

        /*
         * Add your actual StudentClass -> ClassSubject
         * relationship check here.
         *
         * The student must belong to the class represented
         * by assignment.getClassSubject().
         */
    }


    // =========================================================
    // RESPONSE MAPPERS
    // =========================================================

    private AssignmentResponse createAssignmentResponse(
            Assignment assignment) {

        return AssignmentResponse.builder()
                .assignmentId(assignment.getId())
                .assignmentName(assignment.getAssignmentName())
                .description(assignment.getDescription())
                .maxMarks(assignment.getMaxMarks())
                .classSubjectId(
                        assignment
                                .getClassSubject()
                                .getId()
                )
                .teacherSubjectId(
                        assignment
                                .getTeacherSubject()
                                .getId()
                )
                .build();
    }


    private StudentAssignmentResponse
    createStudentAssignmentResponse(
            StudentAssignment studentAssignment) {

        return StudentAssignmentResponse.builder()
                .studentAssignmentId(
                        studentAssignment.getId()
                )
                .assignmentId(
                        studentAssignment
                                .getAssignment()
                                .getId()
                )
                .studentClassId(
                        studentAssignment
                                .getStudentClass()
                                .getId()
                )
                .marks(studentAssignment.getMarks())
                .maxMarks(
                        studentAssignment
                                .getAssignment()
                                .getMaxMarks()
                )
                .build();
    }
}