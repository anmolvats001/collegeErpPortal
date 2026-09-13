package com.example.demo.Exam.Entity;

import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.TeacherSubject.Entity.TeacherSubject;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
        name = "exams",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_exam_subject_date",
                        columnNames = {
                                "class_subject_id",
                                "exam_date",
                                "exam_type"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Exam extends BaseEntity {

    @Column(nullable = false)
    private String examName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamType examType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "class_subject_id",
            nullable = false
    )
    private ClassSubject classSubject;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "teacher_subject_id",
            nullable = false
    )
    private TeacherSubject teacherSubject;

    @Column(nullable = false)
    private LocalDate examDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer maxMarks;

    @Column(nullable = false)
    private Integer passingMarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamStatus status;
}