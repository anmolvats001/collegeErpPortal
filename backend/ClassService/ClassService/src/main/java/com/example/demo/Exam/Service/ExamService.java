package com.example.demo.Exam.Service;

import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.ClassSubject.Repository.ClassSubjectRepo;
import com.example.demo.Exam.Entity.Exam;
import com.example.demo.Exam.Repository.ExamRepo;
import com.example.demo.Exam.Request.ExamRequest;
import com.example.demo.Exam.Response.ExamResponse;
import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import com.example.demo.TeacherSubject.Repository.TeacherSubjectRepo;
import com.example.demo.common.context.CollegeContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepo examRepo;
    private final ClassSubjectRepo classSubjectRepo;
    private final TeacherSubjectRepo teacherSubjectRepo;


    // =====================================================
    // CREATE EXAM
    // =====================================================

    public ExamResponse createExam(
            ExamRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        if (request.getEndTime()
                .isBefore(request.getStartTime())
                ||
                request.getEndTime()
                        .equals(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        if (request.getPassingMarks()
                > request.getMaxMarks()) {

            throw new RuntimeException(
                    "Passing marks cannot be greater than maximum marks"
            );
        }

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

        if (!collegeId.equals(
                classSubject.getCollegeId())) {

            throw new RuntimeException(
                    "You are not authorized to use this ClassSubject"
            );
        }

        if (!collegeId.equals(
                teacherSubject.getCollegeId())) {

            throw new RuntimeException(
                    "You are not authorized to use this TeacherSubject"
            );
        }

        Exam exam = Exam.builder()
                .examName(request.getExamName())
                .examType(request.getExamType())
                .classSubject(classSubject)
                .teacherSubject(teacherSubject)
                .examDate(request.getExamDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxMarks(request.getMaxMarks())
                .passingMarks(request.getPassingMarks())
                .status(request.getStatus())
                .collegeId(collegeId)
                .build();

        return createExamResponse(
                examRepo.save(exam)
        );
    }


    // =====================================================
    // GET EXAM BY ID
    // =====================================================

    public ExamResponse getExam(UUID examId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Exam exam =
                examRepo
                        .findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Exam not found"
                                )
                        );

        checkCollege(exam.getCollegeId());

        return createExamResponse(exam);
    }


    // =====================================================
    // GET ALL EXAMS
    // =====================================================

    public List<ExamResponse> getAllExams() {

        UUID collegeId = CollegeContext.getCollegeId();

        return examRepo
                .findByCollegeIdOrderByExamDateAscStartTimeAsc(
                        collegeId
                )
                .stream()
                .map(this::createExamResponse)
                .toList();
    }


    // =====================================================
    // GET EXAMS OF CLASS SUBJECT
    // =====================================================

    public List<ExamResponse>
    getExamsOfClassSubject(
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return examRepo
                .findByCollegeIdAndClassSubject_IdOrderByExamDateAscStartTimeAsc(
                        collegeId,
                        classSubjectId
                )
                .stream()
                .map(this::createExamResponse)
                .toList();
    }


    // =====================================================
    // GET EXAMS OF TEACHER SUBJECT
    // =====================================================

    public List<ExamResponse>
    getExamsOfTeacherSubject(
            UUID teacherSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        return examRepo
                .findByCollegeIdAndTeacherSubject_IdOrderByExamDateAscStartTimeAsc(
                        collegeId,
                        teacherSubjectId
                )
                .stream()
                .map(this::createExamResponse)
                .toList();
    }


    // =====================================================
    // GET EXAMS BY DATE
    // =====================================================

    public List<ExamResponse>
    getExamsByDate(LocalDate date) {

        UUID collegeId = CollegeContext.getCollegeId();

        return examRepo
                .findByCollegeIdAndExamDateOrderByStartTimeAsc(
                        collegeId,
                        date
                )
                .stream()
                .map(this::createExamResponse)
                .toList();
    }


    // =====================================================
    // UPDATE EXAM
    // =====================================================

    public ExamResponse updateExam(
            UUID examId,
            ExamRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Exam exam =
                examRepo
                        .findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Exam not found"
                                )
                        );

        checkCollege(exam.getCollegeId());

        if (request.getEndTime()
                .isBefore(request.getStartTime())
                ||
                request.getEndTime()
                        .equals(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        if (request.getPassingMarks()
                > request.getMaxMarks()) {

            throw new RuntimeException(
                    "Passing marks cannot be greater than maximum marks"
            );
        }

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

        if (!collegeId.equals(
                classSubject.getCollegeId())) {

            throw new RuntimeException(
                    "Invalid ClassSubject"
            );
        }

        if (!collegeId.equals(
                teacherSubject.getCollegeId())) {

            throw new RuntimeException(
                    "Invalid TeacherSubject"
            );
        }

        exam.setExamName(request.getExamName());
        exam.setExamType(request.getExamType());
        exam.setClassSubject(classSubject);
        exam.setTeacherSubject(teacherSubject);
        exam.setExamDate(request.getExamDate());
        exam.setStartTime(request.getStartTime());
        exam.setEndTime(request.getEndTime());
        exam.setMaxMarks(request.getMaxMarks());
        exam.setPassingMarks(request.getPassingMarks());
        exam.setStatus(request.getStatus());

        return createExamResponse(
                examRepo.save(exam)
        );
    }


    // =====================================================
    // DELETE EXAM
    // =====================================================

    public void deleteExam(UUID examId) {

        Exam exam =
                examRepo
                        .findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Exam not found"
                                )
                        );

        checkCollege(exam.getCollegeId());

        examRepo.delete(exam);
    }


    // =====================================================
    // COMMON
    // =====================================================

    private void checkCollege(UUID entityCollegeId) {

        if (!CollegeContext
                .getCollegeId()
                .equals(entityCollegeId)) {

            throw new RuntimeException(
                    "You are not authorized to perform this operation"
            );
        }
    }


    private ExamResponse createExamResponse(
            Exam exam) {

        return ExamResponse.builder()
                .examId(exam.getId())
                .examName(exam.getExamName())
                .examType(exam.getExamType())
                .classSubjectId(
                        exam.getClassSubject().getId()
                )
                .teacherSubjectId(
                        exam.getTeacherSubject().getId()
                )
                .examDate(exam.getExamDate())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .maxMarks(exam.getMaxMarks())
                .passingMarks(exam.getPassingMarks())
                .status(exam.getStatus())
                .build();
    }
}