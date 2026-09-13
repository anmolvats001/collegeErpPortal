package com.example.demo.Subject.Service;

import com.example.demo.Subject.Entities.Subject;
import com.example.demo.Subject.Repository.SubjectRepo;
import com.example.demo.Subject.Request.SubjectActiveRequest;
import com.example.demo.Subject.Request.SubjectRequest;
import com.example.demo.Subject.Response.SubjectResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.course.Entity.Course;
import com.example.demo.course.Repository.CourseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SubjectService {

    private final SubjectRepo subjectRepo;
    private final CourseRepo courseRepo;

    public SubjectResponse createSubject(SubjectRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Course course = courseRepo
                .findByIdAndCollegeId(
                        request.getCourseId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        boolean exists = subjectRepo
                .existsByCollegeIdAndCourse_IdAndSemesterAndSubjectCode(
                        collegeId,
                        request.getCourseId(),
                        request.getSemester(),
                        request.getSubjectCode()
                );

        if (exists) {
            throw new RuntimeException(
                    "Subject with this code already exists for this course and semester"
            );
        }

        Subject subject = Subject.builder()
                .subjectName(request.getSubjectName())
                .subjectCode(request.getSubjectCode())
                .description(request.getDescription())
                .credits(request.getCredits())
                .semester(request.getSemester())
                .course(course)
                .collegeId(collegeId)
                .build();

        return createSubjectResponse(subjectRepo.save(subject));
    }

    public SubjectResponse getSubject(UUID subjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Subject subject = subjectRepo
                .findByIdAndCollegeId(subjectId, collegeId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        return createSubjectResponse(subject);
    }

    public List<SubjectResponse> getAllSubjectsOfCollege() {

        UUID collegeId = CollegeContext.getCollegeId();

        return subjectRepo
                .findByCollegeId(collegeId)
                .stream()
                .map(this::createSubjectResponse)
                .toList();
    }

    public List<SubjectResponse> getSubjectsOfCourse(UUID courseId) {

        UUID collegeId = CollegeContext.getCollegeId();

        // Verify course belongs to current college
        courseRepo.findByIdAndCollegeId(courseId, collegeId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        return subjectRepo
                .findByCollegeIdAndCourse_Id(
                        collegeId,
                        courseId
                )
                .stream()
                .map(this::createSubjectResponse)
                .toList();
    }

    public List<SubjectResponse> getSubjectsOfCourseAndSemester(
            UUID courseId,
            Integer semester) {

        UUID collegeId = CollegeContext.getCollegeId();

        courseRepo.findByIdAndCollegeId(courseId, collegeId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        return subjectRepo
                .findByCollegeIdAndCourse_IdAndSemester(
                        collegeId,
                        courseId,
                        semester
                )
                .stream()
                .map(this::createSubjectResponse)
                .toList();
    }

    public List<SubjectResponse> searchSubjects(String subjectName) {

        UUID collegeId = CollegeContext.getCollegeId();

        return subjectRepo
                .findByCollegeIdAndSubjectNameContainingIgnoreCase(
                        collegeId,
                        subjectName
                )
                .stream()
                .map(this::createSubjectResponse)
                .toList();
    }

    public SubjectResponse updateSubject(
            UUID subjectId,
            SubjectRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Subject subject = subjectRepo
                .findByIdAndCollegeId(subjectId, collegeId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        Course course = courseRepo
                .findByIdAndCollegeId(
                        request.getCourseId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        subject.setSubjectName(request.getSubjectName());
        subject.setSubjectCode(request.getSubjectCode());
        subject.setDescription(request.getDescription());
        subject.setCredits(request.getCredits());
        subject.setSemester(request.getSemester());
        subject.setCourse(course);

        return createSubjectResponse(subjectRepo.save(subject));
    }

    public SubjectResponse updateSubjectActiveStatus(
            SubjectActiveRequest request) {

        UUID collegeId = CollegeContext.getCollegeId();

        Subject subject = subjectRepo
                .findByIdAndCollegeId(
                        request.getSubjectId(),
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        subject.setIsActive(request.getActive());

        return createSubjectResponse(subjectRepo.save(subject));
    }

    public void deleteSubject(UUID subjectId) {

        UUID collegeId = CollegeContext.getCollegeId();

        Subject subject = subjectRepo
                .findByIdAndCollegeId(
                        subjectId,
                        collegeId
                )
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        // Soft delete
        subject.setIsDeleted(true);
        subject.setIsActive(false);

        subjectRepo.save(subject);
    }

    private SubjectResponse createSubjectResponse(Subject subject) {

        return SubjectResponse.builder()
                .subjectId(subject.getId())
                .subjectName(subject.getSubjectName())
                .subjectCode(subject.getSubjectCode())
                .description(subject.getDescription())
                .credits(subject.getCredits())
                .semester(subject.getSemester())
                .courseId(subject.getCourse().getId())
                .active(subject.getIsActive())
                .build();
    }
}