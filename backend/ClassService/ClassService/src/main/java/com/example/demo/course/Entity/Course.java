package com.example.demo.course.Entity;

import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "courses")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Course extends BaseEntity {

    private String courseName;

    private String courseCode;

    private Integer durationInYears;

    private Integer totalSemesters;

    private String description;
}