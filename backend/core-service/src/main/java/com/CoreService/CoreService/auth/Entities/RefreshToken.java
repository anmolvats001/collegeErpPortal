package com.CoreService.CoreService.auth.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.Instant;


@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    private String id;
    private Instant expiresAt;
    private String userId;
}
