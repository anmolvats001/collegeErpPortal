package com.CoreService.CoreService.Permission.Entities;

import com.CoreService.CoreService.role.Entities.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RolePermissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne(fetch = FetchType.LAZY)
    private PermissionEntity permission;
    @ManyToOne(fetch = FetchType.LAZY)
    private Role role;
}
