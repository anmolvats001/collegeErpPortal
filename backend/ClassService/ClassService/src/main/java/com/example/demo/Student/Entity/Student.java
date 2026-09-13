package com.example.demo.Student.Entity;

import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Student extends BaseEntity {

    private String userId;

    private String enrollmentNumber;

    private String rollNumber;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String profilePhoto;

    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;

    private String guardianName;

    private String guardianPhoneNumber;

    private String address;

    private LocalDate admissionDate;
}