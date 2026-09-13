package com.CoreService.CoreService.College.Entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;

import java.util.UUID;
@Builder
@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class CollegeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID collegeId;
    private String collegeName;
    @Column(unique = true)
    @NonNull
    private String collegeCode;
    private String collegePhone;
    @Column(unique = true)
    @NonNull
    private String collegeEmail;
    private String collegeAddress;
    private String collegeCity;
    private String collegeState;
    private String collegeZip;
    private String collegeCountry;
    @NonNull
    private String universityName;
    @NonNull
    private String universityCode;
    private String collegeDescription;
}
