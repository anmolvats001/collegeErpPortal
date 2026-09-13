package com.example.demo.Assignment.Entity;

import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Assignment extends BaseEntity {

    @Column(nullable = false)
    private String assignmentName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer maxMarks;

    // Which class + subject this assignment belongs to
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "class_subject_id",
            nullable = false
    )
    private ClassSubject classSubject;

    // Which teacher is responsible for this assignment
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "teacher_subject_id",
            nullable = false
    )
    private TeacherSubject teacherSubject;
}