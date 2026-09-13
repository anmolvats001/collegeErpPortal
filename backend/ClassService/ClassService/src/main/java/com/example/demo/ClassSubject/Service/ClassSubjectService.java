package com.example.demo.ClassSubject.Service;

import com.example.demo.Branch.Entities.Branch;
import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Class.Repository.ClassRepo;
import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.ClassSubject.Repository.ClassSubjectRepo;
import com.example.demo.ClassSubject.Request.ClassSubjectActiveRequest;
import com.example.demo.ClassSubject.Request.ClassSubjectRequest;
import com.example.demo.ClassSubject.Response.ClassSubjectResponse;
import com.example.demo.Subject.Entities.Subject;
import com.example.demo.Subject.Repository.SubjectRepo;
import com.example.demo.common.context.CollegeContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassSubjectService {

    private final ClassSubjectRepo classSubjectRepo;
    private final ClassRepo classRepo;
    private final SubjectRepo subjectRepo;

    public ClassSubjectResponse createClassSubject(
            ClassSubjectRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        ClassEntity classEntity = classRepo
                .findByIdAndCollegeId(
                        request.getClassId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Class not found"));

        Subject subject = subjectRepo
                .findByIdAndCollegeId(
                        request.getSubjectId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        /*
         * Make sure subject semester and class semester match.
         */
        if (!classEntity.getSemester()
                .equals(subject.getSemester())) {

            throw new RuntimeException(
                    "Subject semester does not match class semester"
            );
        }

        /*
         * Prevent duplicate assignment.
         */
        if (classSubjectRepo
                .existsByCollegeIdAndClassEntity_IdAndSubject_Id(
                        collegeId,
                        request.getClassId(),
                        request.getSubjectId())) {

            throw new RuntimeException(
                    "Subject is already assigned to this class"
            );
        }

        ClassSubject classSubject = ClassSubject.builder()
                .classEntity(classEntity)
                .subject(subject)
                .collegeId(collegeId)
                .build();

        return createResponse(
                classSubjectRepo.save(classSubject)
        );
    }

    public ClassSubjectResponse getClassSubject(
            UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        ClassSubject classSubject =
                classSubjectRepo
                        .findByIdAndCollegeId(
                                classSubjectId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Class subject not found"
                                ));

        return createResponse(classSubject);
    }

    public List<ClassSubjectResponse> getSubjectsOfClass(
            UUID classId) {

        UUID collegeId = CollegeContext.getCollegeId();

        classRepo.findByIdAndCollegeId(
                        classId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Class not found"));

        return classSubjectRepo
                .findByCollegeIdAndClassEntity_Id(
                        collegeId,
                        classId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<ClassSubjectResponse> getClassesOfSubject(
            UUID subjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        subjectRepo.findByIdAndCollegeId(
                        subjectId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        return classSubjectRepo
                .findByCollegeIdAndSubject_Id(
                        collegeId,
                        subjectId
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public List<ClassSubjectResponse> getAllClassSubjects() {

        UUID collegeId = CollegeContext.getCollegeId();

        return classSubjectRepo
                .findByCollegeId(collegeId)
                .stream()
                .map(this::createResponse)
                .toList();
    }

    public ClassSubjectResponse updateActiveStatus(
            ClassSubjectActiveRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        ClassSubject classSubject =
                classSubjectRepo
                        .findByIdAndCollegeId(
                                request.getClassSubjectId(),
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Class subject not found"
                                ));

        classSubject.setIsActive(request.getActive());

        return createResponse(
                classSubjectRepo.save(classSubject)
        );
    }

    public void deleteClassSubject(UUID classSubjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        ClassSubject classSubject =
                classSubjectRepo
                        .findByIdAndCollegeId(
                                classSubjectId,
                                collegeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Class subject not found"
                                ));

        /*
         * Soft delete
         */
        classSubject.setIsDeleted(true);
        classSubject.setIsActive(false);

        classSubjectRepo.save(classSubject);
    }

    private ClassSubjectResponse createResponse(
            ClassSubject classSubject) {

        ClassEntity classEntity =
                classSubject.getClassEntity();

        Subject subject =
                classSubject.getSubject();

        return ClassSubjectResponse.builder()
                .classSubjectId(classSubject.getId())

                .classId(classEntity.getId())
                .className(classEntity.getClassName())
                .section(classEntity.getSection())

                .subjectId(subject.getId())
                .subjectName(subject.getSubjectName())
                .subjectCode(subject.getSubjectCode())
                .semester(subject.getSemester())

                .active(classSubject.getIsActive())
                .build();
    }
}