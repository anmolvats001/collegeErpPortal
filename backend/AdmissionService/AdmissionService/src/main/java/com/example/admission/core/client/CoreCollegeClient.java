package com.example.admission.core.client;

import com.example.admission.core.dto.CollegePublicResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "core-college-client", url = "${core-service.url}")
public interface CoreCollegeClient {
    @GetMapping("/api/v1/core/public/code/{collegeCode}")
    CollegePublicResponse getCollegeByCode(@PathVariable String collegeCode);

    @GetMapping("/api/v1/core/public/id/{collegeId}")
    CollegePublicResponse getCollegeById(@PathVariable java.util.UUID collegeId);
}
