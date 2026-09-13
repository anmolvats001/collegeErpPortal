package com.example.demo.Assignment.Entity;

import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "student_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_assignment_student",
                        columnNames = {
                                "assignment_id",
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
public class StudentAssignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "assignment_id",
            nullable = false
    )
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "student_class_id",
            nullable = false
    )
    private StudentClass studentClass;

    @Column(nullable = false)
    private Integer marks;
}