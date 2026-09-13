package com.example.fee.controller;

import com.example.fee.request.FeeFormWindowRequest;
import com.example.fee.response.*;
import com.example.fee.service.FeeFormService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/fee/forms")
public class FeeFormController {
    private final FeeFormService service;

    public FeeFormController(FeeFormService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("(hasRole('COLLEGE_ADMIN') or hasAuthority('OPEN_FEE_FORM')) and hasAuthority('MODULE_FEE')")
    public FeeFormWindowResponse create(@Valid @RequestBody FeeFormWindowRequest r) {
        return service.create(r);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('UPDATE_FEE_FORM')")
    public FeeFormWindowResponse update(@PathVariable UUID id, @Valid @RequestBody FeeFormWindowRequest r) {
        return service.update(id, r);
    }

    @GetMapping("/status")
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE_FORM')")
    public FeeFormStatusResponse status() {
        return service.status();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE_FORM') and !hasRole('STUDENT')")
    public List<FeeFormWindowResponse> all() {
        return service.all();
    }
}
