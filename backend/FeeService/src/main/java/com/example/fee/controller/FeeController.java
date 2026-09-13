package com.example.fee.controller;

import com.example.fee.request.*;
import com.example.fee.response.FeeResponse;
import com.example.fee.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/fee")
public class FeeController {
    private final FeeService service;

    public FeeController(FeeService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('CREATE_FEE')")
    public FeeResponse create(@Valid @RequestBody CreateFeeRequest r) {
        return service.create(r);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('UPDATE_FEE')")
    public FeeResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateFeeRequest r) {
        return service.update(id, r);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT') and hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE')")
    public FeeResponse my() {
        return service.getMy();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE') and !hasRole('STUDENT')")
    public FeeResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MODULE_FEE') and hasAuthority('VIEW_FEE') and !hasRole('STUDENT')")
    public List<FeeResponse> all() {
        return service.all();
    }
}
