package com.example.fee.repository;

import com.example.fee.entity.FeeFormWindow;
import org.springframework.data.jpa.repository.*;

import java.time.LocalDateTime;
import java.util.*;

public interface FeeFormWindowRepository extends JpaRepository<FeeFormWindow, UUID> {
    Optional<FeeFormWindow> findFirstByCollegeIdAndActiveTrueAndOpenAtLessThanEqualAndCloseAtGreaterThanEqualOrderByOpenAtDesc(UUID collegeId, LocalDateTime now1, LocalDateTime now2);

    List<FeeFormWindow> findAllByCollegeIdOrderByOpenAtDesc(UUID collegeId);
}
