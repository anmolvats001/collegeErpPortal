package com.example.fee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "fee_payments")
@Getter
@Setter
@NoArgsConstructor
public class FeePayment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "college_id", nullable = false)
    private UUID collegeId;
    @Column(name = "student_user_id", nullable = false)
    private String studentUserId;
    @Column(length = 320)
    private String email;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;
    @Column(name = "transaction_ids", nullable = false, length = 2000)
    private String transactionIds;
    @ElementCollection
    @CollectionTable(name = "fee_payment_proof_images", joinColumns = @JoinColumn(name = "payment_id"))
    @Column(name = "image_url", nullable = false, length = 1000)
    private List<String> proofImages = new ArrayList<>();
    @Column(length = 2000)
    private String remarks;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    @Column(length = 2000)
    private String rejectionReason;

    @PrePersist
    void prePersist() {
        if (submittedAt == null) submittedAt = LocalDateTime.now();
    }
}
