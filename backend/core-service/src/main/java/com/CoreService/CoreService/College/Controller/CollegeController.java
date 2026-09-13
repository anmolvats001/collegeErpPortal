package com.CoreService.CoreService.College.Controller;

import com.CoreService.CoreService.College.Dto.CollegeDto;
import com.CoreService.CoreService.College.Request.CollegeDataRequest;
import com.CoreService.CoreService.College.Response.CollegeDataResponse;
import com.CoreService.CoreService.College.Response.MultipleCollegesDataResponse;
import com.CoreService.CoreService.College.Services.CollegeService;
import com.CoreService.CoreService.common.Response.BasicResponse;
import com.CoreService.CoreService.common.context.CollegeContext;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/core/college")
public class CollegeController {
    @Autowired
    private CollegeService collegeService;

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @PostMapping("/createCollege")
    public ResponseEntity<BasicResponse> createCollege(@RequestBody @Valid CollegeDataRequest collegeDataRequest) {
        Boolean isCreated=collegeService.createCollege(collegeDataRequest);
        if(isCreated){
            return ResponseEntity.ok(BasicResponse.builder().message("College Created Successfully").success(true).build());
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BasicResponse.builder().message("College Not Implemented").success(false).build());
        }
    }
    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/allCollege")
    public ResponseEntity<MultipleCollegesDataResponse> getAllCollege(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10")int size) {
        Page<CollegeDto> collegesData=collegeService.getAllCollege(page,size);
        return ResponseEntity.ok(MultipleCollegesDataResponse.builder().colleges(collegesData).success(true).build());
    }
    @PreAuthorize("hasAuthority('VIEW_SETTINGS')")
    @GetMapping("/myCollege")
    public ResponseEntity<CollegeDataResponse> getCollege() {
        if(CollegeContext.getCollegeId()==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().message("College not found").success(false).college(null).build());
        }
        CollegeDto collegeDto= collegeService.getCollegeByCollegeId(CollegeContext.getCollegeId());
        if(collegeDto==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().message("College not found").success(false).college(null).build());
        }
        return ResponseEntity.ok(CollegeDataResponse.builder().college(collegeDto).success(true).message("Found College Data").build());
    }
    @PreAuthorize("hasAuthority('UPDATE_SETTINGS')")
    @PutMapping("/")
    public ResponseEntity<CollegeDataResponse> updateCollegeData(@RequestBody @Valid CollegeDataRequest collegeDataRequest) {
        if(CollegeContext.getCollegeId()==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().message("College not found").success(false).college(null).build());
        }
        CollegeDto collegeDto= collegeService.updateCollegeData(CollegeContext.getCollegeId(),collegeDataRequest);
        if(collegeDto==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().message("College not found").success(false).college(null).build());
        }
        return ResponseEntity.ok(CollegeDataResponse.builder().college(collegeDto).success(true).message("College Data Updated").build());
    }
    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @DeleteMapping("/")
    public ResponseEntity<BasicResponse> deleteCollege() {
        if(CollegeContext.getCollegeId()==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().message("College not found").success(false).college(null).build());
        }
        Boolean isDeleted= collegeService.deleteCollegeData(CollegeContext.getCollegeId());
        if(isDeleted){
            return ResponseEntity.ok(BasicResponse.builder().message("College Deleted Successfully").success(true).build());
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body(BasicResponse.builder().message("College Not Deleted").build());
    }
    @GetMapping("/public/code/{collegeCode}")
    public ResponseEntity<CollegeDto> getPublicCollegeByCode(@PathVariable String collegeCode) {
        CollegeDto collegeDto = collegeService.getCollegeByCollegeCode(collegeCode);
        if (collegeDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(collegeDto);
    }

    @GetMapping("/public/id/{collegeId}")
    public ResponseEntity<CollegeDto> getPublicCollegeById(@PathVariable UUID collegeId) {
        CollegeDto collegeDto = collegeService.getCollegeByCollegeId(collegeId);
        if (collegeDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(collegeDto);
    }

    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/{collegeId}")
    public ResponseEntity<CollegeDataResponse> getCollegeById(@PathVariable("collegeId") UUID collegeId) {
        if(collegeId==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().success(false).college(null).message("College ID is missing").build());
        }
        CollegeDto collegeDto=collegeService.getCollegeByCollegeId(collegeId);
        if(collegeDto==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CollegeDataResponse.builder().success(false).college(null).message("College Not Found").build());
        }
        return ResponseEntity.ok(CollegeDataResponse.builder().success(true).message("Found College Data").college(collegeDto).build());
    }
    @PreAuthorize("hasRole('MAIN_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<MultipleCollegesDataResponse> searchColleges(@RequestParam(required = false) String collegeName,
                                                                       @RequestParam(required = false) String universityName,
                                                                       @RequestParam(required = false) String city,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        Page<CollegeDto> colleges = collegeService.searchColleges(collegeName, universityName, city, page, size);
        return ResponseEntity.ok(
                MultipleCollegesDataResponse
                        .builder()
                        .success(true)
                        .message("Colleges fetched successfully")
                        .colleges(colleges)
                        .build());
    }
}
