package com.example.demo.Branch.Entities;

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
        name = "branches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_branch_course_code",
                        columnNames = {"course_id", "branch_code"}
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Branch extends BaseEntity {

    private String branchName;

    private String branchCode;

    private String branchDescription;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}