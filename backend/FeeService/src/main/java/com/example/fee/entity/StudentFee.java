package com.example.fee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_fees", uniqueConstraints = @UniqueConstraint(name = "uk_fee_college_student", columnNames = {"college_id", "student_user_id"}))
@Getter
@Setter
@NoArgsConstructor
public class StudentFee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "college_id", nullable = false)
    private UUID collegeId;
    @Column(name = "student_user_id", nullable = false)
    private String studentUserId;
    private String studentName;
    private UUID courseId;
    private String courseName;
    private UUID branchId;
    private String branchName;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal totalFee;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal remainingAmount;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeeStatus status = FeeStatus.PENDING;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        recalculate();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
        recalculate();
    }

    public void recalculate() {
        if (totalFee == null) totalFee = BigDecimal.ZERO;
        if (paidAmount == null) paidAmount = BigDecimal.ZERO;
        remainingAmount = totalFee.subtract(paidAmount).max(BigDecimal.ZERO);
        if (remainingAmount.compareTo(BigDecimal.ZERO) == 0) status = FeeStatus.PAID;
        else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) status = FeeStatus.PARTIALLY_PAID;
        else status = FeeStatus.PENDING;
    }
}
