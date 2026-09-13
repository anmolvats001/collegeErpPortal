package com.CoreService.CoreService.role.Repository;

import com.CoreService.CoreService.role.Entities.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository

public interface RoleRepository extends CrudRepository<Role, UUID> {

    void deleteAllByCollege_collegeId(UUID collegeId);

    List<Role> findAllByCollege_collegeId(UUID collegeId);

    boolean existsByRoleNameAndCollege_collegeId(String roleName, UUID collegeId);

    Optional<Role> findByRoleIdAndCollege_collegeId(UUID roleId, UUID collegeId);
    boolean existsByRoleNameAndCollegeIsNull(String roleName);

    Optional<Role> findByRoleNameAndCollegeIsNull(String roleName);
}
