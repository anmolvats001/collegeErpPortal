package com.example.demo.Subject.Entities;

import com.example.demo.common.BaseEntities.BaseEntity;
import com.example.demo.course.Entity.Course;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "subjects",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_subject_course_semester_code",
                        columnNames = {
                                "course_id",
                                "semester",
                                "subject_code"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Subject extends BaseEntity {

    private String subjectName;

    private String subjectCode;

    private String description;

    private Integer credits;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private Integer semester;
}