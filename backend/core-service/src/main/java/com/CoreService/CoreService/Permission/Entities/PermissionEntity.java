package com.CoreService.CoreService.Permission.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionEntity {
    @NonNull
    private String permissionName;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String permissionId;
    private String permissionCode;
    private String permissionDescription;
}
