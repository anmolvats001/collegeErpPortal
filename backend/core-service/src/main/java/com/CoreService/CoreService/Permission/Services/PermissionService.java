package com.CoreService.CoreService.Permission.Services;

import com.CoreService.CoreService.Permission.Entities.PermissionEntity;
import com.CoreService.CoreService.Permission.Repository.PermissionRepository;
import com.CoreService.CoreService.Permission.Requests.PermissionRequest;
import com.CoreService.CoreService.Permission.Responses.MultiplePermissionResponse;
import com.CoreService.CoreService.Permission.Responses.PermissionReponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public boolean addPermission(PermissionRequest permissionRequest) {
        try{
            if(permissionRepository.existsByPermissionCode(permissionRequest.getPermissionCode())) {
                return false;
            }
            PermissionEntity permission=PermissionEntity.builder().permissionCode(permissionRequest.getPermissionCode()).permissionName(permissionRequest.getPermissionName()).permissionDescription(permissionRequest.getPermissionDescription()).build();
            permissionRepository.save(permission);
            return true;
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
    }
    public void deletePermission(String permissionCode) {
        try{
            if(permissionRepository.existsByPermissionCode(permissionCode)) {
                permissionRepository.deleteByPermissionCode(permissionCode);
            }
            else{
                throw new RuntimeException("Permission code does not exist");
            }
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
    }
    public MultiplePermissionResponse getAllPermissions() {
        List<PermissionEntity> permissions=permissionRepository.findAll();
        List<PermissionReponse> permissionReponses=permissions.stream().map(e->mapTo(e)).collect(Collectors.toUnmodifiableList());
        return MultiplePermissionResponse.builder().permssions(permissionReponses).success(true).message("Got All Permissions").build();
    }
    public PermissionReponse mapTo(PermissionEntity permissionEntity) {
        return PermissionReponse.builder().permissionId(permissionEntity.getPermissionId()).permissionCode(permissionEntity.getPermissionCode()).permissionDescription(permissionEntity.getPermissionDescription()).permissionName(permissionEntity.getPermissionName()).build();
    }

    public MultiplePermissionResponse searchPermissions(String keyword) {

        return MultiplePermissionResponse.builder().permssions( permissionRepository
                .findByPermissionCodeContainingIgnoreCaseOrPermissionNameContainingIgnoreCaseOrPermissionDescriptionContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword)
                .stream()
                .map(this::mapTo)
                .toList()).build();
    }
    public boolean existsByPermissionCode(String permissionCode) {

        return permissionRepository.existsByPermissionCode(permissionCode);
    }
}
