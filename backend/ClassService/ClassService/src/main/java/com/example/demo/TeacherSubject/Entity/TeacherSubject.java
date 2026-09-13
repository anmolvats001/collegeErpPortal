package com.example.demo.TeacherSubject.Entity;

import com.example.demo.ClassSubject.Entity.ClassSubject;
import com.example.demo.Teacher.Entity.Teacher;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "teacher_subjects",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_teacher_class_subject",
                        columnNames = {
                                "teacher_id",
                                "class_subject_id"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSubject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_subject_id", nullable = false)
    private ClassSubject classSubject;
}