package com.example.demo.course.Repository;

import com.example.demo.course.Entity.Course;
import com.example.demo.course.Response.CourseResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepo extends JpaRepository<Course, UUID> {
    List<Course> findByCollegeId(UUID collegeId);

    List<Course> findByCollegeIdAndCourseNameContainingIgnoreCase(
            UUID collegeId,
            String courseName
    );
    Optional<Course> findByIdAndCollegeId(UUID courseId, UUID collegeId);
}
