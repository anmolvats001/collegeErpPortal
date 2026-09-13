package com.example.fee.service;

import com.example.fee.common.context.*;
import com.example.fee.entity.*;
import com.example.fee.repository.*;
import com.example.fee.request.*;
import com.example.fee.response.*;
import com.example.fee.notification.NotificationProducer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class FeePaymentService {
    private final FeePaymentRepository payments;
    private final StudentFeeRepository fees;
    private final FeeFormWindowRepository windows;
    private final NotificationProducer notificationProducer;

    public FeePaymentService(FeePaymentRepository payments, StudentFeeRepository fees, FeeFormWindowRepository windows, NotificationProducer notificationProducer) {
        this.payments = payments;
        this.fees = fees;
        this.windows = windows;
        this.notificationProducer = notificationProducer;
    }

    @Transactional
    public FeePaymentResponse submit(PaymentFormRequest r) {
        UUID c = college();
        String s = user();
        LocalDateTime now = LocalDateTime.now();
        windows.findFirstByCollegeIdAndActiveTrueAndOpenAtLessThanEqualAndCloseAtGreaterThanEqualOrderByOpenAtDesc(c, now, now).orElseThrow(() -> new IllegalStateException("Fee payment form is currently closed"));
        StudentFee f = fees.findByCollegeIdAndStudentUserId(c, s).orElseThrow(() -> new NoSuchElementException("Fee not found"));
        if (f.getRemainingAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalStateException("Fee is already fully paid");
        if (r.amount().compareTo(f.getRemainingAmount()) > 0)
            throw new IllegalArgumentException("Payment amount exceeds remaining fee");
        if (payments.existsByCollegeIdAndStudentUserIdAndStatus(c, s, PaymentStatus.PENDING))
            throw new IllegalStateException("You already have a pending payment form");
        FeePayment p = new FeePayment();
        p.setCollegeId(c);
        p.setStudentUserId(s);
        p.setEmail(r.email());
        p.setAmount(r.amount());
        p.setPaymentMethod(r.paymentMethod());
        p.setTransactionIds(r.transactionIds().trim());
        p.setProofImages(new ArrayList<>(r.proofImages()));
        p.setRemarks(r.remarks());
        p.setStatus(PaymentStatus.PENDING);
        return to(payments.save(p));
    }

    public List<FeePaymentResponse> my() {
        return payments.findAllByCollegeIdAndStudentUserIdOrderBySubmittedAtDesc(college(), user()).stream().map(this::to).toList();
    }

    public List<FeePaymentResponse> all() {
        return payments.findAllByCollegeIdOrderBySubmittedAtDesc(college()).stream().map(this::to).toList();
    }

    @Transactional
    public FeePaymentResponse approve(UUID id) {
        FeePayment p = find(id);
        if (p.getStatus() != PaymentStatus.PENDING)
            throw new IllegalStateException("Only pending payment can be approved");
        StudentFee f = fees.findByCollegeIdAndStudentUserId(college(), p.getStudentUserId()).orElseThrow(() -> new NoSuchElementException("Fee not found"));
        if (p.getAmount().compareTo(f.getRemainingAmount()) > 0)
            throw new IllegalStateException("Payment exceeds remaining fee");
        f.setPaidAmount(f.getPaidAmount().add(p.getAmount()));
        f.recalculate();
        p.setStatus(PaymentStatus.APPROVED);
        p.setReviewedAt(LocalDateTime.now());
        p.setReviewedBy(user());
        payments.save(p);
        fees.save(f);
        notificationProducer.send(
                p.getEmail(),
                "Fee Payment Approved",
                "Your fee payment of " + p.getAmount() + " has been approved successfully."
        );
        return to(p);
    }

    @Transactional
    public FeePaymentResponse reject(UUID id, RejectFeeFormRequest r) {
        FeePayment p = find(id);
        if (p.getStatus() != PaymentStatus.PENDING)
            throw new IllegalStateException("Only pending payment can be rejected");
        p.setStatus(PaymentStatus.REJECTED);
        p.setRejectionReason(r.rejectionReason());
        p.setReviewedAt(LocalDateTime.now());
        p.setReviewedBy(user());
        FeePayment saved = payments.save(p);
        notificationProducer.send(
                saved.getEmail(),
                "Fee Payment Rejected",
                "Your fee payment of " + saved.getAmount() + " was rejected.\n\nReason: " + (saved.getRejectionReason() == null ? "Not specified" : saved.getRejectionReason())
        );
        return to(saved);
    }

    private FeePayment find(UUID id) {
        return payments.findById(id).filter(p -> p.getCollegeId().equals(college())).orElseThrow(() -> new NoSuchElementException("Payment form not found"));
    }

    private UUID college() {
        UUID x = CollegeContext.getCollegeId();
        if (x == null) throw new IllegalStateException("College context missing");
        return x;
    }

    private String user() {
        String x = UserContext.getUserId();
        if (x == null) throw new IllegalStateException("User context missing");
        return x;
    }

    private FeePaymentResponse to(FeePayment p) {
        return new FeePaymentResponse(p.getId(), p.getStudentUserId(), p.getAmount(), p.getPaymentMethod(), p.getTransactionIds(), p.getProofImages(), p.getRemarks(), p.getStatus(), p.getSubmittedAt(), p.getReviewedAt(), p.getReviewedBy(), p.getRejectionReason());
    }
}
