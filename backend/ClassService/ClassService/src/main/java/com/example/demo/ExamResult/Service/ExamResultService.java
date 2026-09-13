package com.example.demo.ExamResult.Service;

import com.example.demo.Exam.Entity.Exam;
import com.example.demo.Exam.Repository.ExamRepo;
import com.example.demo.ExamResult.Entity.ExamResult;
import com.example.demo.ExamResult.Repository.ExamResultRepo;
import com.example.demo.ExamResult.Request.BulkExamResultRequest;
import com.example.demo.ExamResult.Request.ExamResultRequest;
import com.example.demo.ExamResult.Request.StudentExamMarks;
import com.example.demo.ExamResult.Response.ExamResultResponse;
import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.StudentClass.Repository.StudentClassRepo;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.notification.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamResultService {

    private final ExamResultRepo examResultRepo;
    private final ExamRepo examRepo;
    private final StudentClassRepo studentClassRepo;
    private final NotificationProducer notificationProducer;


    // =====================================================
    // CREATE RESULT
    // =====================================================

    public ExamResultResponse createResult(
            ExamResultRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Exam exam = getExam(
                request.getExamId()
        );

        StudentClass studentClass =
                getStudentClass(
                        request.getStudentClassId()
                );

        validateCollege(
                exam.getCollegeId()
        );

        validateCollege(
                studentClass.getCollegeId()
        );

        validateMarks(
                request.getMarks(),
                exam.getMaxMarks()
        );

        if (examResultRepo
                .findByExam_IdAndStudentClass_Id(
                        exam.getId(),
                        studentClass.getId()
                )
                .isPresent()) {

            throw new RuntimeException(
                    "Result already exists for this student"
            );
        }

        ExamResult result = ExamResult.builder()
                .exam(exam)
                .studentClass(studentClass)
                .marks(request.getMarks())
                .collegeId(collegeId)
                .build();

        ExamResult saved = examResultRepo.save(result);
        notificationProducer.send(
                saved.getStudentClass().getStudent().getEmail(),
                "Exam Result Published",
                "Dear " + saved.getStudentClass().getStudent().getFirstName() + ",\n\nYour result for " + saved.getExam().getExamName() + " is now available.\nMarks: " + saved.getMarks() + "/" + saved.getExam().getMaxMarks()
        );
        return createResponse(saved);
    }


    // =====================================================
    // BULK CREATE RESULTS
    // =====================================================

    public List<ExamResultResponse> createBulkResults(
            BulkExamResultRequest request) {

        Exam exam = getExam(
                request.getExamId()
        );

        validateCollege(
                exam.getCollegeId()
        );

        return request.getResults()
                .stream()
                .map(studentMarks ->
                        createSingleResult(
                                exam,
                                studentMarks
                        )
                )
                .toList();
    }


    private ExamResultResponse createSingleResult(
            Exam exam,
            StudentExamMarks studentMarks) {

        StudentClass studentClass =
                getStudentClass(
                        studentMarks.getStudentClassId()
                );

        validateCollege(
                studentClass.getCollegeId()
        );

        validateMarks(
                studentMarks.getMarks(),
                exam.getMaxMarks()
        );

        if (examResultRepo
                .findByExam_IdAndStudentClass_Id(
                        exam.getId(),
                        studentClass.getId()
                )
                .isPresent()) {

            throw new RuntimeException(
                    "Result already exists for student: "
                            + studentClass.getId()
            );
        }

        ExamResult result = ExamResult.builder()
                .exam(exam)
                .studentClass(studentClass)
                .marks(studentMarks.getMarks())
                .collegeId(
                        CollegeContext.getCollegeId()
                )
                .build();

        ExamResult saved = examResultRepo.save(result);
        notificationProducer.send(
                saved.getStudentClass().getStudent().getEmail(),
                "Exam Result Published",
                "Dear " + saved.getStudentClass().getStudent().getFirstName() + ",\n\nYour result for " + saved.getExam().getExamName() + " is now available.\nMarks: " + saved.getMarks() + "/" + saved.getExam().getMaxMarks()
        );
        return createResponse(saved);
    }


    // =====================================================
    // GET RESULT
    // =====================================================

    public ExamResultResponse getResult(
            UUID resultId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        ExamResult result =
                examResultRepo
                        .findByIdAndCollegeId(
                                resultId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found"
                                )
                        );

        return createResponse(result);
    }


    // =====================================================
    // GET RESULTS OF EXAM
    // =====================================================

    public List<ExamResultResponse>
    getResultsOfExam(UUID examId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        Exam exam = getExam(examId);

        validateCollege(exam.getCollegeId());

        return examResultRepo
                .findByCollegeIdAndExam_IdOrderByMarksDesc(
                        collegeId,
                        examId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }


    // =====================================================
    // GET STUDENT RESULTS
    // =====================================================

    public List<ExamResultResponse>
    getStudentResults(UUID studentClassId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        StudentClass studentClass =
                getStudentClass(studentClassId);

        validateCollege(
                studentClass.getCollegeId()
        );

        return examResultRepo
                .findByCollegeIdAndStudentClass_Id(
                        collegeId,
                        studentClassId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }


    // =====================================================
    // GET STUDENT RESULT OF EXAM
    // =====================================================

    public ExamResultResponse
    getStudentResultOfExam(
            UUID examId,
            UUID studentClassId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        return examResultRepo
                .findByCollegeIdAndExam_IdAndStudentClass_Id(
                        collegeId,
                        examId,
                        studentClassId
                )
                .map(this::createResponse)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Result not found"
                        )
                );
    }


    // =====================================================
    // GET RESULTS OF SUBJECT
    // =====================================================

    public List<ExamResultResponse>
    getResultsOfSubject(
            UUID classSubjectId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        return examResultRepo
                .findByCollegeIdAndExam_ClassSubject_IdOrderByExam_ExamDateAsc(
                        collegeId,
                        classSubjectId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }


    // =====================================================
    // UPDATE RESULT
    // =====================================================

    public ExamResultResponse updateResult(
            UUID resultId,
            Integer marks) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        ExamResult result =
                examResultRepo
                        .findByIdAndCollegeId(
                                resultId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found"
                                )
                        );

        validateMarks(
                marks,
                result.getExam().getMaxMarks()
        );

        result.setMarks(marks);

        return createResponse(
                examResultRepo.save(result)
        );
    }


    // =====================================================
    // DELETE RESULT
    // =====================================================

    public void deleteResult(UUID resultId) {

        UUID collegeId =
                CollegeContext.getCollegeId();

        ExamResult result =
                examResultRepo
                        .findByIdAndCollegeId(
                                resultId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found"
                                )
                        );

        examResultRepo.delete(result);
    }


    // =====================================================
    // HELPERS
    // =====================================================

    private Exam getExam(UUID examId) {

        return examRepo
                .findById(examId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Exam not found"
                        )
                );
    }


    private StudentClass getStudentClass(
            UUID studentClassId) {

        return studentClassRepo
                .findById(studentClassId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "StudentClass not found"
                        )
                );
    }


    private void validateCollege(
            UUID entityCollegeId) {

        if (!CollegeContext
                .getCollegeId()
                .equals(entityCollegeId)) {

            throw new RuntimeException(
                    "You are not authorized to perform this operation"
            );
        }
    }


    private void validateMarks(
            Integer marks,
            Integer maxMarks) {

        if (marks < 0 || marks > maxMarks) {

            throw new RuntimeException(
                    "Marks must be between 0 and "
                            + maxMarks
            );
        }
    }


    private ExamResultResponse createResponse(
            ExamResult result) {

        int maxMarks =
                result.getExam().getMaxMarks();

        int passingMarks =
                result.getExam().getPassingMarks();

        ExamResultResponse response = ExamResultResponse.builder()
                .resultId(result.getId())
                .examId(result.getExam().getId())
                .studentClassId(
                        result.getStudentClass().getId()
                )
                .marks(result.getMarks())
                .maxMarks(maxMarks)
                .passed(
                        result.getMarks()
                                >= passingMarks
                )
                .build();

        return response;
    }
}