package com.example.fee.controller;

import com.example.fee.request.*;
import com.example.fee.response.FeePaymentResponse;
import com.example.fee.service.FeePaymentService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/fee/payments")
public class FeePaymentController {
    private final FeePaymentService service;

    public FeePaymentController(FeePaymentService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') and hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE_FORM')")
    public FeePaymentResponse submit(@Valid @RequestBody PaymentFormRequest r) {
        return service.submit(r);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT') and hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE_FORM')")
    public List<FeePaymentResponse> my() {
        return service.my();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE_FORM') and !hasRole('STUDENT')")
    public List<FeePaymentResponse> all() {
        return service.all();
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("(hasRole('COLLEGE_ADMIN') or hasAuthority('APPROVE_FEE_FORM')) and hasAuthority('MODULE_FEE')")
    public FeePaymentResponse approve(@PathVariable UUID id) {
        return service.approve(id);
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("(hasRole('COLLEGE_ADMIN') or hasAuthority('REJECT_FEE_FORM')) and hasAuthority('MODULE_FEE')")
    public FeePaymentResponse reject(@PathVariable UUID id, @Valid @RequestBody RejectFeeFormRequest r) {
        return service.reject(id, r);
    }
}
