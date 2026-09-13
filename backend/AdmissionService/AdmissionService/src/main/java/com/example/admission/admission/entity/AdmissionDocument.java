package com.example.admission.admission.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admission_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private UUID applicationId;
    @Column(nullable = false)
    private String documentType;
    @Column(nullable = false)
    private String fileName;
    private String fileUrl;
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    @Column(nullable = false)
    private Boolean verified = false;
}
