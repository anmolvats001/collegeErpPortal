package com.CoreService.CoreService.College.Repository;

import com.CoreService.CoreService.College.Entities.CollegeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollegeRepository extends JpaRepository<CollegeEntity,UUID> {
    Optional<CollegeEntity> findByCollegeId(UUID id);
    Optional<CollegeEntity> findByCollegeCodeIgnoreCase(String collegeCode);
    Page<CollegeEntity> findByCollegeNameContainingIgnoreCase(String collegeName, Pageable pageable);
    Page<CollegeEntity> findByUniversityNameContainingIgnoreCase(String universityName, Pageable pageable);
    Page<CollegeEntity> findByCollegeCityContainingIgnoreCase(String city, Pageable pageable);
    Page<CollegeEntity> findByCollegeNameContainingIgnoreCaseAndUniversityNameContainingIgnoreCase(String collegeName, String universityName,Pageable pageable);
}
