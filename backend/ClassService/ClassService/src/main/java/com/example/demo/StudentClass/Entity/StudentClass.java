package com.example.demo.StudentClass.Entity;
import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Student.Entity.Student;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "student_classes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_class_year_semester",
                        columnNames = {
                                "student_id",
                                "class_id",
                                "academic_year",
                                "semester"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClass extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    private Integer academicYear;

    private Integer semester;

    private String rollNumber;
}