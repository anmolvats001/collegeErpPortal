package com.CoreService.CoreService.role.Entities;

import com.CoreService.CoreService.College.Entities.CollegeEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roleId;
    private String roleName;
    private String roleDescription;
    @ManyToOne(fetch = FetchType.LAZY)
    @Nullable
    private CollegeEntity college;
}