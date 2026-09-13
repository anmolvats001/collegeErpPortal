package com.example.demo.ClassSubject.Entity;

import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Subject.Entities.Subject;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "class_subjects",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_class_subject",
                        columnNames = {
                                "class_id",
                                "subject_id"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSubject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
}