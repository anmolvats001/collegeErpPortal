package com.example.fee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fee_form_windows")
@Getter
@Setter
@NoArgsConstructor
public class FeeFormWindow {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "college_id", nullable = false)
    private UUID collegeId;
    @Column(nullable = false)
    private String formName;
    @Column(nullable = false)
    private LocalDateTime openAt;
    @Column(nullable = false)
    private LocalDateTime closeAt;
    @Column(nullable = false)
    private boolean active = true;
    @Column(nullable = false)
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
