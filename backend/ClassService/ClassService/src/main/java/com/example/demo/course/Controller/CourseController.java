package com.example.demo.course.Controller;

import com.example.demo.common.Response.BasicResponse;
import com.example.demo.course.Entity.Course;
import com.example.demo.course.Request.CourseActiveRequest;
import com.example.demo.course.Request.CourseRequest;
import com.example.demo.course.Response.CourseResponse;
import com.example.demo.course.Services.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/api/v1/class/course", "/api/v1/class/courses"})
public class CourseController {
    private final CourseService courseService;

    @PostMapping()
    @PreAuthorize("hasAuthority('CREATE_COURSE')")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody @Valid CourseRequest courseRequest) {
        return ResponseEntity.ok(courseService.createCourse(courseRequest));
    }
    @GetMapping({"", "/college"})
    @PreAuthorize("hasAuthority('GET_COURSE')")
    public ResponseEntity<List<CourseResponse>> getCoursesOfMyCollege() {
        return ResponseEntity.ok(courseService.getAllCoursesOfCollege());
    }
    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAuthority('GET_ALL_COLLEGE_COURSE')")

    public ResponseEntity<List<CourseResponse>> getCoursesOfCollegeById(@PathVariable UUID collegeId) {
        return ResponseEntity.ok(courseService.getAllCoursesOfCollegeById(collegeId));
    }
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('GET_COURSE')")
    public ResponseEntity<List<CourseResponse>> searchCourses(
            @RequestParam String courseName) {

        return ResponseEntity.ok(
                courseService.searchCourses(courseName)
        );
    }
    @GetMapping("/{courseId}")
    @PreAuthorize("hasAuthority('GET_COURSE')")
    public ResponseEntity<CourseResponse> getCourse(
            @PathVariable UUID courseId) {

        return ResponseEntity.ok(
                courseService.getCourse(courseId)
        );
    }
    @PatchMapping("/active")
    @PreAuthorize("hasAuthority('UPDATE_COURSE')")
    public ResponseEntity<CourseResponse> updateCourseActive(@RequestBody CourseActiveRequest courseActiveRequest) {
        return ResponseEntity.ok(courseService.updateCourseActiveStatus(courseActiveRequest));
    }
    @PatchMapping("/{courseId}")
    @PreAuthorize("hasAuthority('UPDATE_COURSE')")
    public ResponseEntity<CourseResponse> updateCourse(@RequestBody CourseRequest courseRequest,@PathVariable UUID courseId) {
        return ResponseEntity.ok(courseService.updateCourseInfo(courseRequest,courseId));
    }
    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasAuthority('DELETE_COURSE')")
    public ResponseEntity<BasicResponse> deleteCourse(
            @PathVariable UUID courseId) {

        courseService.deleteCourse(courseId);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .message("Course deleted successfully")
                        .success(true)
                        .build()
        );
    }
}
