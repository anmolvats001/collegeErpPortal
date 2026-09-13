package com.example.demo.Class.Service;

import com.example.demo.Branch.Entities.Branch;
import com.example.demo.Branch.Repository.BranchRepo;
import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.Class.Repository.ClassRepo;
import com.example.demo.Class.Request.ClassActiveRequest;
import com.example.demo.Class.Request.ClassRequest;
import com.example.demo.Class.Response.ClassResponse;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service("classManagementService")
@RequiredArgsConstructor
public class ClassService {
    private final ClassRepo classRepository;
    private final BranchRepo branchRepository;
    public ClassResponse createClass(ClassRequest classRequest) {
        Branch branch = branchRepository.findById(classRequest.getBranchId()).orElseThrow(()-> new RuntimeException("Branch not found"));
        if(!branch.getCollegeId().equals(CollegeContext.getCollegeId()))throw new RuntimeException("College id not found");
        ClassEntity classEntity = ClassEntity.builder()
                .className(classRequest.getClassName())
                .semester(classRequest.getSemester())
                .branch(branch)
                .section(classRequest.getSection())
                .academicYear(classRequest.getAcademicYear())
                .createdBy(UserContext.getUserId())
                .updatedBy(UserContext.getUserId())
                .collegeId(CollegeContext.getCollegeId())
                .build();
        ClassEntity classEntityFromRepo=classRepository.save(classEntity);
        return createClassResponse(classEntityFromRepo);
    }
    public List<ClassResponse> getAllClassesOfBranchAndSemester(UUID branchId, Integer semester) {
        Branch branch = branchRepository.findById(branchId).orElseThrow(()-> new RuntimeException("Branch not found"));
        if(!branch.getCollegeId().equals(CollegeContext.getCollegeId())) {
            throw new RuntimeException("College id not match");
        }
        List<ClassEntity> classEntities=classRepository.findByBranch_IdAndSemester(branchId,semester);
        List<ClassResponse> classResponses=new ArrayList<>();
        for(ClassEntity classEntity:classEntities){
            classResponses.add(ClassResponse.builder().className(classEntity.getClassName()).build());

        }
        return classResponses;
    }
    public ClassResponse getClassByClassId(UUID classId) {
        ClassEntity classEntity=classRepository.findById(classId).orElseThrow(()-> new RuntimeException("Class not found"));
        return ClassResponse.builder().className(classEntity.getClassName()).build();
    }
    public List<ClassResponse> getClassesByBranch(UUID branchId){
        List<ClassEntity> classEntities=classRepository.findByBranch_Id(branchId);
        List<ClassResponse> classResponses=new ArrayList<>();
        for(ClassEntity classEntity:classEntities){
            classResponses.add(ClassResponse.builder().className(classEntity.getClassName()).build());
        }
        return classResponses;
    }
    public List<ClassResponse> getAllClassesOfCollege(){
        List<ClassEntity> classEntities=classRepository.findByCollegeId(CollegeContext.getCollegeId());
        List<ClassResponse> classResponses=new ArrayList<>();
        for(ClassEntity classEntity:classEntities){
            classResponses.add(ClassResponse.builder().className(classEntity.getClassName()).build());
        }
        return classResponses;
    }
    public List<ClassResponse> searchClasses(String className) {

        UUID collegeId = CollegeContext.getCollegeId();

        return classRepository
                .findByCollegeIdAndClassNameContainingIgnoreCase(
                        collegeId,
                        className
                )
                .stream()
                .map(this::createClassResponse)
                .toList();
    }
    public ClassResponse updateClass(UUID classId,ClassRequest classRequest) {
        ClassEntity classEntity = classRepository.findByIdAndCollegeId(classId,CollegeContext.getCollegeId()).orElseThrow(()-> new RuntimeException("Class not found"));
        classEntity.setClassName(classRequest.getClassName());
        classEntity.setSemester(classRequest.getSemester());
        classEntity.setAcademicYear(classRequest.getAcademicYear());
        classEntity.setUpdatedBy(UserContext.getUserId());
        ClassEntity classEntity1=classRepository.save(classEntity);
        return createClassResponse(classEntity1);
    }
    public ClassResponse updateClassActiveStatus(ClassActiveRequest classActiveRequest) {
        ClassEntity classEntity= classRepository.findByIdAndCollegeId(classActiveRequest.getClassId(),CollegeContext.getCollegeId()).orElseThrow(()-> new RuntimeException("Class not found"));
        classEntity.setIsActive(classActiveRequest.isActive());
        classEntity.setUpdatedBy(UserContext.getUserId());
       ClassEntity classEntity1= classRepository.save(classEntity);
        return createClassResponse(classEntity1);
    }
    public void deleteClass(UUID classId) {
        ClassEntity classEntity = classRepository.findByIdAndCollegeId(classId, CollegeContext.getCollegeId()).orElseThrow(() -> new RuntimeException("Class not found"));
        classRepository.delete(classEntity);
    }
    private ClassResponse createClassResponse(ClassEntity classEntity) {
        return ClassResponse.builder().classId(classEntity.getId()).className(classEntity.getClassName())
                .branchName(classEntity.getBranch().getBranchName()).semester(classEntity.getSemester())
                .section(classEntity.getSection())
                .academicYear(classEntity.getAcademicYear()).build();
    }

}
