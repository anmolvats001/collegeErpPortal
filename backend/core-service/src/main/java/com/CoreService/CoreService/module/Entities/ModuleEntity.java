package com.CoreService.CoreService.module.Entities;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ModuleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String moduleId;
    private String moduleName;
    private String moduleDescription;
    @Column(nullable = false, unique = true)
    private String moduleCode;
}
