package com.example.admission.admission.service;

import com.example.admission.admission.entity.*;
import com.example.admission.admission.repository.*;
import com.example.admission.admission.request.*;
import com.example.admission.admission.response.*;
import com.example.admission.common.context.*;
import com.example.admission.core.client.CoreCollegeClient;
import com.example.admission.core.dto.CollegePublicResponse;
import com.example.admission.notification.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdmissionService {
    private final AdmissionApplicationRepository appRepo;
    private final AdmissionDocumentRepository docRepo;
    private final CoreCollegeClient core;
    private final NotificationProducer notificationProducer;

    @Transactional
    public AdmissionApplicationResponse applyByCode(String code, AdmissionApplicationRequest r) {
        CollegePublicResponse c = core.getCollegeByCode(code);
        if (c == null || c.getCollegeId() == null) throw new IllegalArgumentException("College not found");
        AdmissionApplication a = build(c.getCollegeId(), c.getCollegeCode(), r);
        AdmissionApplication saved = appRepo.save(a);
        notificationProducer.send(
                saved.getEmail(),
                "Admission Application Submitted - " + saved.getApplicationNumber(),
                "Dear " + saved.getApplicantName() + ",\n\nYour admission application " + saved.getApplicationNumber() + " has been submitted successfully to " + c.getCollegeName() + ".\n\nCurrent status: SUBMITTED."
        );
        return map(saved);
    }

    @Transactional
    public AdmissionApplicationResponse applyById(UUID id, AdmissionApplicationRequest r) {
        CollegePublicResponse c = core.getCollegeById(id);
        if (c == null || c.getCollegeId() == null) throw new IllegalArgumentException("College not found");
        AdmissionApplication a = build(c.getCollegeId(), c.getCollegeCode(), r);
        AdmissionApplication saved = appRepo.save(a);
        notificationProducer.send(
                saved.getEmail(),
                "Admission Application Submitted - " + saved.getApplicationNumber(),
                "Dear " + saved.getApplicantName() + ",\n\nYour admission application " + saved.getApplicationNumber() + " has been submitted successfully to " + c.getCollegeName() + ".\n\nCurrent status: SUBMITTED."
        );
        return map(saved);
    }

    private AdmissionApplication build(UUID collegeId, String code, AdmissionApplicationRequest r) {
        return AdmissionApplication.builder().applicationNumber("ADM-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()).collegeId(collegeId).collegeCode(code).applicantName(r.getApplicantName()).email(r.getEmail()).phoneNumber(r.getPhoneNumber()).dateOfBirth(r.getDateOfBirth()).gender(r.getGender()).address(r.getAddress()).fatherName(r.getFatherName()).motherName(r.getMotherName()).courseId(r.getCourseId()).courseName(r.getCourseName()).branchId(r.getBranchId()).branchName(r.getBranchName()).previousQualification(r.getPreviousQualification()).previousInstitution(r.getPreviousInstitution()).previousPercentage(r.getPreviousPercentage()).status(AdmissionStatus.SUBMITTED).submittedAt(LocalDateTime.now()).build();
    }

    public Page<AdmissionApplicationResponse> list(int page, int size, AdmissionStatus status) {
        UUID cid = requireCollege();
        Pageable p = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
        Page<AdmissionApplication> a = status == null ? appRepo.findByCollegeIdOrderBySubmittedAtDesc(cid, p) : appRepo.findByCollegeIdAndStatusOrderBySubmittedAtDesc(cid, status, p);
        return a.map(this::map);
    }

    public AdmissionApplicationResponse get(UUID id) {
        return map(tenant(id));
    }

    @Transactional
    public AdmissionApplicationResponse review(UUID id) {
        AdmissionApplication a = tenant(id);
        if (a.getStatus() != AdmissionStatus.SUBMITTED)
            throw new IllegalStateException("Only submitted applications can be moved to review");
        a.setStatus(AdmissionStatus.UNDER_REVIEW);
        a.setReviewedBy(UserContext.getUserId());
        a.setReviewedAt(LocalDateTime.now());
        return map(appRepo.save(a));
    }

    @Transactional
    public AdmissionApplicationResponse approve(UUID id) {
        AdmissionApplication a = tenant(id);
        ensureOpen(a);
        a.setStatus(AdmissionStatus.APPROVED);
        a.setReviewedBy(UserContext.getUserId());
        a.setReviewedAt(LocalDateTime.now());
        AdmissionApplication saved = appRepo.save(a);
        notificationProducer.send(
                saved.getEmail(),
                "Admission Application Approved - " + saved.getApplicationNumber(),
                "Dear " + saved.getApplicantName() + ",\n\nCongratulations. Your admission application " + saved.getApplicationNumber() + " has been approved."
        );
        return map(saved);
    }

    @Transactional
    public AdmissionApplicationResponse reject(UUID id, RejectAdmissionRequest req) {
        AdmissionApplication a = tenant(id);
        ensureOpen(a);
        a.setStatus(AdmissionStatus.REJECTED);
        a.setRejectionReason(req.getReason());
        a.setReviewedBy(UserContext.getUserId());
        a.setReviewedAt(LocalDateTime.now());
        AdmissionApplication saved = appRepo.save(a);
        notificationProducer.send(
                saved.getEmail(),
                "Admission Application Rejected - " + saved.getApplicationNumber(),
                "Dear " + saved.getApplicantName() + ",\n\nYour admission application " + saved.getApplicationNumber() + " has been rejected.\n\nReason: " + (saved.getRejectionReason() == null ? "Not specified" : saved.getRejectionReason())
        );
        return map(saved);
    }

    public DashboardResponse dashboard() {
        UUID c = requireCollege();
        return DashboardResponse.builder().totalApplications(appRepo.countByCollegeId(c)).submitted(appRepo.countByCollegeIdAndStatus(c, AdmissionStatus.SUBMITTED)).underReview(appRepo.countByCollegeIdAndStatus(c, AdmissionStatus.UNDER_REVIEW)).approved(appRepo.countByCollegeIdAndStatus(c, AdmissionStatus.APPROVED)).rejected(appRepo.countByCollegeIdAndStatus(c, AdmissionStatus.REJECTED)).build();
    }

    @Transactional
    public DocumentResponse addDocument(UUID id, DocumentRequest r) {
        tenant(id);
        AdmissionDocument d = AdmissionDocument.builder().applicationId(id).documentType(r.getDocumentType()).fileName(r.getFileName()).fileUrl(r.getFileUrl()).uploadedAt(LocalDateTime.now()).verified(false).build();
        return doc(docRepo.save(d));
    }

    @Transactional
    public DocumentResponse verifyDocument(UUID documentId, boolean verified) {
        AdmissionDocument d = docRepo.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        // Verify tenant
        tenant(d.getApplicationId());
        d.setVerified(verified);
        return doc(docRepo.save(d));
    }

    public List<DocumentResponse> documents(UUID id) {
        tenant(id);
        return docRepo.findByApplicationIdOrderByUploadedAtAsc(id).stream().map(this::doc).toList();
    }

    public AdmissionApplicationResponse track(String ref) {
        AdmissionApplication a = appRepo.findByApplicationNumber(ref)
                .or(() -> appRepo.findFirstByEmailIgnoreCaseOrderBySubmittedAtDesc(ref))
                .orElseThrow(() -> new IllegalArgumentException("Application not found for reference: " + ref));
        return map(a);
    }

    public List<DocumentResponse> trackDocuments(String ref) {
        AdmissionApplication a = appRepo.findByApplicationNumber(ref)
                .or(() -> appRepo.findFirstByEmailIgnoreCaseOrderBySubmittedAtDesc(ref))
                .orElseThrow(() -> new IllegalArgumentException("Application not found for reference: " + ref));
        return docRepo.findByApplicationIdOrderByUploadedAtAsc(a.getId()).stream().map(this::doc).toList();
    }

    private AdmissionApplication tenant(UUID id) {
        AdmissionApplication a = appRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Application not found"));
        if (!requireCollege().equals(a.getCollegeId())) throw new IllegalArgumentException("Application not found");
        return a;
    }

    private UUID requireCollege() {
        UUID id = CollegeContext.getCollegeId();
        if (id == null) throw new IllegalStateException("CollegeId header is required");
        return id;
    }

    private void ensureOpen(AdmissionApplication a) {
        if (a.getStatus() == AdmissionStatus.APPROVED || a.getStatus() == AdmissionStatus.REJECTED)
            throw new IllegalStateException("Application has already been finalized");
    }

    private AdmissionApplicationResponse map(AdmissionApplication a) {
        return AdmissionApplicationResponse.builder().id(a.getId()).applicationNumber(a.getApplicationNumber()).collegeId(a.getCollegeId()).collegeCode(a.getCollegeCode()).applicantName(a.getApplicantName()).email(a.getEmail()).phoneNumber(a.getPhoneNumber()).dateOfBirth(a.getDateOfBirth()).gender(a.getGender()).address(a.getAddress()).fatherName(a.getFatherName()).motherName(a.getMotherName()).courseId(a.getCourseId()).courseName(a.getCourseName()).branchId(a.getBranchId()).branchName(a.getBranchName()).previousQualification(a.getPreviousQualification()).previousInstitution(a.getPreviousInstitution()).previousPercentage(a.getPreviousPercentage()).status(a.getStatus()).submittedAt(a.getSubmittedAt()).reviewedAt(a.getReviewedAt()).reviewedBy(a.getReviewedBy()).rejectionReason(a.getRejectionReason()).build();
    }

    private DocumentResponse doc(AdmissionDocument d) {
        return DocumentResponse.builder().id(d.getId()).applicationId(d.getApplicationId()).documentType(d.getDocumentType()).fileName(d.getFileName()).fileUrl(d.getFileUrl()).uploadedAt(d.getUploadedAt()).verified(d.getVerified()).build();
    }
}
