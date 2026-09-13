package com.example.admission.admission.repository;

import com.example.admission.admission.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdmissionApplicationRepository extends JpaRepository<AdmissionApplication, UUID> {
    Page<AdmissionApplication> findByCollegeIdOrderBySubmittedAtDesc(UUID id, Pageable p);

    Page<AdmissionApplication> findByCollegeIdAndStatusOrderBySubmittedAtDesc(UUID id, AdmissionStatus s, Pageable p);

    Optional<AdmissionApplication> findByApplicationNumber(String applicationNumber);

    Optional<AdmissionApplication> findFirstByEmailIgnoreCaseOrderBySubmittedAtDesc(String email);

    long countByCollegeId(UUID id);

    long countByCollegeIdAndStatus(UUID id, AdmissionStatus s);
}

