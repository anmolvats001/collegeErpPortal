package com.CoreService.CoreService.module.Controller;

import com.CoreService.CoreService.common.Response.BasicResponse;
import com.CoreService.CoreService.module.Request.ModuleDataRequest;
import com.CoreService.CoreService.module.Response.ModuleDataResponse;
import com.CoreService.CoreService.module.Services.ModuleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/core/module")
public class ModuleController {
    @Autowired
    private ModuleService moduleService;

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @PostMapping("/createModule")
    public ResponseEntity<BasicResponse> createModule(@RequestBody ModuleDataRequest module) {
        Boolean result = moduleService.createModule(module);
        if (result) {
            return ResponseEntity.ok(BasicResponse.builder().success(true).message("Module Added Successfully").build());
        }
        return ResponseEntity.ok(BasicResponse.builder().success(false).message("Module Creation Failed").build());
    }
    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/getAllModules")
    public List<ModuleDataResponse> getAllModules(){
        List<ModuleDataResponse> moduleDataResponses = moduleService.getModules();
        return moduleDataResponses;
    }
}
