package com.CoreService.CoreService.College.Controller;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.College.Services.CollegeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/core/public")
@RequiredArgsConstructor
public class CollegePublicController {

    private final CollegeService collegeService;

    @GetMapping("/code/{collegeCode}")
    public ResponseEntity<CollegeDto> getPublicCollegeByCode(@PathVariable String collegeCode) {
        CollegeDto collegeDto = collegeService.getCollegeByCollegeCode(collegeCode);
        if (collegeDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(collegeDto);
    }

    @GetMapping("/id/{collegeId}")
    public ResponseEntity<CollegeDto> getPublicCollegeById(@PathVariable UUID collegeId) {
        CollegeDto collegeDto = collegeService.getCollegeByCollegeId(collegeId);
        if (collegeDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(collegeDto);
    }
}
