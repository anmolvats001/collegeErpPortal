package com.CoreService.CoreService.module.Controller;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.College.Response.MultipleCollegesDataResponse;
import com.CoreService.CoreService.common.Response.BasicResponse;
import com.CoreService.CoreService.module.Request.CollegeModuleRequest;
import com.CoreService.CoreService.module.Response.ModuleDataResponse;
import com.CoreService.CoreService.module.Response.MultipleModuleDataResponse;
import com.CoreService.CoreService.module.Services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/core/college-modules")
@RequiredArgsConstructor
public class CollegeModuleController {

    private final ModuleService moduleService;

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @PostMapping
    public ResponseEntity<BasicResponse> assignModuleToCollege(
            @RequestBody CollegeModuleRequest request
    ) {
        boolean created = moduleService.addModuleToCollege(request);

        if (!created) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BasicResponse.builder()
                            .success(false)
                            .message("Unable to assign module to college.")
                            .build());
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BasicResponse.builder()
                        .success(true)
                        .message("Module assigned successfully.")
                        .build());
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @PatchMapping("/status")
    public ResponseEntity<BasicResponse> updateModuleStatus(
            @RequestBody CollegeModuleRequest request
    ) {

        boolean updated = moduleService.changeEnablility(request);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BasicResponse.builder()
                            .success(false)
                            .message("Unable to update module status.")
                            .build());
        }

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Module status updated successfully.")
                        .build()
        );
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/college/{collegeId}")
    public ResponseEntity<MultipleModuleDataResponse> getModulesOfCollege(
            @PathVariable UUID collegeId
    ) {

        List<ModuleDataResponse> modules =
                moduleService.getAllModulesOfCollege(collegeId);

        return ResponseEntity.ok(
                MultipleModuleDataResponse.builder()
                        .success(true)
                        .message("Modules fetched successfully.")
                        .modules(modules)
                        .build()
        );
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/colleges")
    public ResponseEntity<MultipleCollegesDataResponse> getCollegesByModule(

            @RequestParam String moduleCode,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        Page<CollegeDto> colleges =
                moduleService.getAllCollegeIfModulePresent(
                        moduleCode,
                        page,
                        size
                );

        return ResponseEntity.ok(
                MultipleCollegesDataResponse.builder()
                        .success(true)
                        .message("Colleges fetched successfully.")
                        .colleges(colleges)
                        .build()
        );
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/exists")
    public ResponseEntity<BasicResponse> isModuleAssigned(

            @RequestParam UUID collegeId,

            @RequestParam String moduleCode
    ) {

        boolean exists =
                moduleService.isModuleExistInCollege(
                        collegeId,
                        moduleCode
                );

        if (!exists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(
                            BasicResponse.builder()
                                    .success(false)
                                    .message("Module is not assigned to the college.")
                                    .build()
                    );
        }

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Module is assigned to the college.")
                        .build()
        );
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @DeleteMapping("/college/{collegeId}")
    public ResponseEntity<BasicResponse> removeAllModulesFromCollege(
            @PathVariable UUID collegeId
    ) {

        boolean deleted =
                moduleService.deleteCollegeModule(collegeId);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(
                            BasicResponse.builder()
                                    .success(false)
                                    .message("Unable to remove modules.")
                                    .build()
                    );
        }

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("All modules removed successfully.")
                        .build()
        );
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @DeleteMapping("/college/{collegeId}/module/{moduleCode}")
    public ResponseEntity<BasicResponse> removeModuleFromCollege(

            @PathVariable UUID collegeId,

            @PathVariable String moduleCode
    ) {

        boolean deleted =
                moduleService.deleteModuleOfCollege(
                        collegeId,
                        moduleCode
                );

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(
                            BasicResponse.builder()
                                    .success(false)
                                    .message("Unable to remove module.")
                                    .build()
                    );
        }

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .success(true)
                        .message("Module removed successfully.")
                        .build()
        );
    }
}