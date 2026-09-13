package com.example.demo.Notice.Repository;

import com.example.demo.Notice.Entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NoticeRepo extends JpaRepository<Notice, UUID> {

    Optional<Notice> findByIdAndCollegeId(
            UUID noticeId,
            UUID collegeId
    );

    List<Notice> findByCollegeIdOrderByPublishDateDesc(
            UUID collegeId
    );

    List<Notice> findByCollegeIdAndIsActiveTrueOrderByPublishDateDesc(
            UUID collegeId
    );

    List<Notice>
    findByCollegeIdAndIsActiveTrueAndPublishDateLessThanEqualAndExpiryDateGreaterThanEqualOrderByPublishDateDesc(
            UUID collegeId,
            LocalDateTime publishDate,
            LocalDateTime expiryDate
    );
}