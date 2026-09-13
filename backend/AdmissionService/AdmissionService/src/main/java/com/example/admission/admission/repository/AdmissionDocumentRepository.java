package com.example.admission.admission.repository;

import com.example.admission.admission.entity.AdmissionDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface AdmissionDocumentRepository extends JpaRepository<AdmissionDocument, UUID> {
    List<AdmissionDocument> findByApplicationIdOrderByUploadedAtAsc(UUID id);
}
