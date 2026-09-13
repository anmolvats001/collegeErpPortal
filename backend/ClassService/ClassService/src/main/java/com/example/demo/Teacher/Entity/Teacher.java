package com.example.demo.Teacher.Entity;

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
@Table(name = "teachers")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Teacher extends BaseEntity {

    private String userId;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String designation;

    private String department;

    private LocalDate joiningDate;

    private String qualification;
}