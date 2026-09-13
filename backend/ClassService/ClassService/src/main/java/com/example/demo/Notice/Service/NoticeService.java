package com.example.demo.Notice.Service;

import com.example.demo.Notice.Entity.Notice;
import com.example.demo.Notice.Repository.NoticeRepo;
import com.example.demo.Notice.Request.NoticeRequest;
import com.example.demo.Notice.Response.NoticeResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.Student.Repository.StudentRepo;
import com.example.demo.Student.Entity.Student;
import com.example.demo.notification.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepo noticeRepo;
    private final StudentRepo studentRepo;
    private final NotificationProducer notificationProducer;


    // CREATE
    public NoticeResponse createNotice(
            NoticeRequest request) {

        if (request.getExpiryDate() != null &&
                !request.getExpiryDate()
                        .isAfter(request.getPublishDate())) {

            throw new RuntimeException(
                    "Expiry date must be after publish date"
            );
        }

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .publishDate(request.getPublishDate())
                .expiryDate(request.getExpiryDate())
                .collegeId(CollegeContext.getCollegeId())
                .isActive(true)
                .build();

        Notice saved = noticeRepo.save(notice);
        if (!saved.getPublishDate().isAfter(LocalDateTime.now())) {
            List<Student> students = studentRepo.findByCollegeId(saved.getCollegeId());
            for (Student student : students) {
                if (Boolean.TRUE.equals(student.getIsDeleted()) || !Boolean.TRUE.equals(student.getIsActive())) {
                    continue;
                }
                notificationProducer.send(
                        student.getEmail(),
                        "New Notice - " + saved.getTitle(),
                        saved.getDescription() == null ? "A new notice has been published." : saved.getDescription()
                );
            }
        }
        return createResponse(saved);
    }


    // GET BY ID
    public NoticeResponse getNotice(
            UUID noticeId) {

        Notice notice =
                noticeRepo
                        .findByIdAndCollegeId(
                                noticeId,
                                CollegeContext.getCollegeId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notice not found"
                                )
                        );

        return createResponse(notice);
    }


    // GET ALL COLLEGE NOTICES
    public List<NoticeResponse> getAllNotices() {

        return noticeRepo
                .findByCollegeIdOrderByPublishDateDesc(
                        CollegeContext.getCollegeId()
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }


    // GET ACTIVE NOTICES
    public List<NoticeResponse> getActiveNotices() {

        return noticeRepo
                .findByCollegeIdAndIsActiveTrueOrderByPublishDateDesc(
                        CollegeContext.getCollegeId()
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }


    // GET CURRENTLY VALID NOTICES
    public List<NoticeResponse> getCurrentNotices() {

        LocalDateTime now = LocalDateTime.now();

        return noticeRepo
                .findByCollegeIdAndIsActiveTrueAndPublishDateLessThanEqualAndExpiryDateGreaterThanEqualOrderByPublishDateDesc(
                        CollegeContext.getCollegeId(),
                        now,
                        now
                )
                .stream()
                .map(this::createResponse)
                .toList();
    }

    // UPDATE
    public NoticeResponse updateNotice(
            UUID noticeId,
            NoticeRequest request) {

        Notice notice =
                noticeRepo
                        .findByIdAndCollegeId(
                                noticeId,
                                CollegeContext.getCollegeId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notice not found"
                                )
                        );

        if (request.getExpiryDate() != null &&
                !request.getExpiryDate()
                        .isAfter(request.getPublishDate())) {

            throw new RuntimeException(
                    "Expiry date must be after publish date"
            );
        }

        notice.setTitle(request.getTitle());
        notice.setDescription(request.getDescription());
        notice.setPublishDate(request.getPublishDate());
        notice.setExpiryDate(request.getExpiryDate());

        return createResponse(
                noticeRepo.save(notice)
        );
    }


    // DEACTIVATE
    public void deactivateNotice(
            UUID noticeId) {

        Notice notice =
                noticeRepo
                        .findByIdAndCollegeId(
                                noticeId,
                                CollegeContext.getCollegeId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notice not found"
                                )
                        );

        notice.setIsActive(false);

        noticeRepo.save(notice);
    }


    // DELETE
    public void deleteNotice(
            UUID noticeId) {

        Notice notice =
                noticeRepo
                        .findByIdAndCollegeId(
                                noticeId,
                                CollegeContext.getCollegeId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notice not found"
                                )
                        );

        noticeRepo.delete(notice);
    }


    private NoticeResponse createResponse(
            Notice notice) {

        return NoticeResponse.builder()
                .noticeId(notice.getId())
                .title(notice.getTitle())
                .description(notice.getDescription())
                .publishDate(notice.getPublishDate())
                .expiryDate(notice.getExpiryDate())
                .active(notice.getIsActive())
                .build();
    }
}