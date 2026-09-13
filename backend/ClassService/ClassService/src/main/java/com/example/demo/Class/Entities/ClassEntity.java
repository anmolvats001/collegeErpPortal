package com.example.demo.Class.Entities;

import com.example.demo.Branch.Entities.Branch;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "classes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_branch_section_semester_year",
                        columnNames = {
                                "branch_id",
                                "section",
                                "semester",
                                "academic_year"
                        }
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity extends BaseEntity {

    private String className;

    private String section;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    private Integer academicYear;

    private Integer semester;
}