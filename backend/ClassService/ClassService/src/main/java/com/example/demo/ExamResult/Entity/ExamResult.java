package com.example.demo.ExamResult.Entity;

import com.example.demo.Exam.Entity.Exam;
import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "exam_results",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_exam_student",
                        columnNames = {
                                "exam_id",
                                "student_class_id"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResult extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "exam_id",
            nullable = false
    )
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "student_class_id",
            nullable = false
    )
    private StudentClass studentClass;

    @Column(nullable = false)
    private Integer marks;
}