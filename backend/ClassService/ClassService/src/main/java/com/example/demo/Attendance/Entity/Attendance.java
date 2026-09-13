package com.example.demo.Attendance.Entity;

import com.example.demo.StudentClass.Entity.StudentClass;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "attendance",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_session_student",
                        columnNames = {
                                "attendance_session_id",
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
public class Attendance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "attendance_session_id",
            nullable = false
    )
    private AttendanceSession attendanceSession;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "student_class_id",
            nullable = false
    )
    private StudentClass studentClass;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;
}