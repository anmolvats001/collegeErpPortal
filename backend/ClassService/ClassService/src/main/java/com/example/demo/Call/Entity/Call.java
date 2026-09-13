package com.example.demo.Call.Entity;

import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "calls",
        indexes = {
                @Index(
                        name = "idx_call_college",
                        columnList = "college_id"
                ),
                @Index(
                        name = "idx_call_join_code",
                        columnList = "join_code",
                        unique = true
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Call extends BaseEntity {

    @Column(
            name = "created_by",
            nullable = false
    )
    private String createdBy;

    @Column(
            name = "join_code",
            nullable = false,
            unique = true
    )
    private String joinCode;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "call_type",
            nullable = false
    )
    private CallType callType;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false
    )
    private CallStatus status;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;
}