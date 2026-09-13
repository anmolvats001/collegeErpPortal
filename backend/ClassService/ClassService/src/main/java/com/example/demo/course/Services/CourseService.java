package com.example.demo.course.Services;

import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import com.example.demo.course.Entity.Course;
import com.example.demo.course.Repository.CourseRepo;
import com.example.demo.course.Request.CourseActiveRequest;
import com.example.demo.course.Request.CourseRequest;
import com.example.demo.course.Response.CourseResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepo courseRepo;

    @Transactional
    public CourseResponse createCourse(CourseRequest courseRequest) {
            Course course = Course.builder()
                    .courseCode(courseRequest.getCourseCode())
                    .courseName(courseRequest.getCourseName())
                    .totalSemesters(courseRequest.getTotalSemesters())
                    .durationInYears(courseRequest.getDurationInYears())
                    .description(courseRequest.getDescription())
                    .createdBy(UserContext.getUserId())
                    .updatedBy(UserContext.getUserId())
                    .collegeId(CollegeContext.getCollegeId())
                    .build();
            Course courseFromRepo= courseRepo.save(course);
            return createCourseResponse(courseFromRepo);
    }
    public List<CourseResponse> getAllCoursesOfCollege() {
        List<Course> courses= courseRepo.findByCollegeId(CollegeContext.getCollegeId());
        List<CourseResponse> courseResponses = new ArrayList<>();
        for (Course course : courses) {
            courseResponses.add(createCourseResponse(course));
        }
        return courseResponses;
    }
    public List<CourseResponse> getAllCoursesOfCollegeById(UUID  collegeId) {
        List<Course> courses= courseRepo.findByCollegeId(collegeId);
        List<CourseResponse> courseResponses = new ArrayList<>();
        for (Course course : courses) {
            courseResponses.add(createCourseResponse(course));
        }
        return courseResponses;
    }
    public CourseResponse updateCourseActiveStatus( CourseActiveRequest courseActiveRequest) {
        Course course = courseRepo.findById(courseActiveRequest.getCourseId()).orElseThrow(()->new RuntimeException("Course not found"));
        if(!course.getCollegeId().equals(CollegeContext.getCollegeId())) {
            throw new RuntimeException("You are not authorized to perform this operation");
        }
        course.setIsActive(courseActiveRequest.isActive());
        course.setUpdatedBy(UserContext.getUserId());
        Course courseFromRepo= courseRepo.save(course);
        return createCourseResponse(courseFromRepo);
    }
    public CourseResponse updateCourseInfo(CourseRequest courseRequest,UUID courseId) {
        Course course = courseRepo.findById(courseId).orElseThrow(()->new RuntimeException("Course not found"));
        if(!course.getCollegeId().equals(CollegeContext.getCollegeId())) {
            throw new RuntimeException("You are not authorized to perform this operation");
        }
        if(courseRequest.getCourseName()!=null) {
            course.setCourseName(courseRequest.getCourseName());
        }
        if(courseRequest.getTotalSemesters()!=null) {
            course.setTotalSemesters(courseRequest.getTotalSemesters());
        }
        if(courseRequest.getDurationInYears()!=null) {
            course.setDurationInYears(courseRequest.getDurationInYears());
        }
        if(courseRequest.getDescription()!=null) {
            course.setDescription(courseRequest.getDescription());
        }
        course.setUpdatedBy(UserContext.getUserId());
        Course courseFromRepo= courseRepo.save(course);
        return createCourseResponse(courseFromRepo);
    }
    public boolean deleteCourse(UUID courseId) {
        Course course =courseRepo.findById(courseId).orElseThrow(()->new RuntimeException("Course not found"));
        if(course.getCollegeId().equals(CollegeContext.getCollegeId())) {
            courseRepo.delete(course);
            return true;
        }
        else  {
            throw new RuntimeException("You are not authorized to perform this operation");
        }
    }
    public List<CourseResponse> searchCourses(String courseName) {

        UUID collegeId = CollegeContext.getCollegeId();

        List<Course> courses =
                courseRepo.findByCollegeIdAndCourseNameContainingIgnoreCase(
                        collegeId,
                        courseName
                );

        return courses.stream()
                .map(this::createCourseResponse)
                .toList();
    }
    public CourseResponse getCourse(UUID courseId) {
        Course course= courseRepo.findByIdAndCollegeId(courseId,CollegeContext.getCollegeId()).orElseThrow(()->new RuntimeException("Course not found"));
        return createCourseResponse(course);
    }
    private CourseResponse createCourseResponse(Course  course) {
        return CourseResponse.builder().courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .totalSemesters(course.getTotalSemesters())
                .durationInYears(course.getDurationInYears())
                .description(course.getDescription())
                .courseId(course.getId())
                .active(course.getIsActive())
                .build();
    }
}
