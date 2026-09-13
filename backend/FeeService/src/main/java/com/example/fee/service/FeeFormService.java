package com.example.fee.service;

import com.example.fee.common.context.*;
import com.example.fee.entity.FeeFormWindow;
import com.example.fee.repository.FeeFormWindowRepository;
import com.example.fee.request.FeeFormWindowRequest;
import com.example.fee.response.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FeeFormService {
    private final FeeFormWindowRepository repo;

    public FeeFormService(FeeFormWindowRepository repo) {
        this.repo = repo;
    }

    public FeeFormWindowResponse create(FeeFormWindowRequest r) {
        FeeFormWindow w = new FeeFormWindow();
        w.setCollegeId(college());
        w.setFormName(r.formName());
        w.setOpenAt(r.openAt());
        w.setCloseAt(r.closeAt());
        w.setActive(r.active());
        w.setCreatedBy(user());
        return to(repo.save(w));
    }

    public FeeFormWindowResponse update(UUID id, FeeFormWindowRequest r) {
        FeeFormWindow w = find(id);
        w.setFormName(r.formName());
        w.setOpenAt(r.openAt());
        w.setCloseAt(r.closeAt());
        w.setActive(r.active());
        return to(repo.save(w));
    }

    public List<FeeFormWindowResponse> all() {
        return repo.findAllByCollegeIdOrderByOpenAtDesc(college()).stream().map(this::to).toList();
    }

    public FeeFormStatusResponse status() {
        LocalDateTime now = LocalDateTime.now();
        Optional<FeeFormWindow> o = repo.findFirstByCollegeIdAndActiveTrueAndOpenAtLessThanEqualAndCloseAtGreaterThanEqualOrderByOpenAtDesc(college(), now, now);
        return o.map(w -> new FeeFormStatusResponse(true, w.getId(), w.getFormName(), w.getOpenAt(), w.getCloseAt())).orElseGet(() -> new FeeFormStatusResponse(false, null, null, null, null));
    }

    private FeeFormWindow find(UUID id) {
        return repo.findById(id).filter(w -> w.getCollegeId().equals(college())).orElseThrow(() -> new NoSuchElementException("Fee form window not found"));
    }

    private UUID college() {
        UUID x = CollegeContext.getCollegeId();
        if (x == null) throw new IllegalStateException("College context missing");
        return x;
    }

    private String user() {
        String x = UserContext.getUserId();
        if (x == null) throw new IllegalStateException("User context missing");
        return x;
    }

    private FeeFormWindowResponse to(FeeFormWindow w) {
        return new FeeFormWindowResponse(w.getId(), w.getFormName(), w.getOpenAt(), w.getCloseAt(), w.isActive(), w.getCreatedBy());
    }
}
