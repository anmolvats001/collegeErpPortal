package com.CoreService.CoreService.user.Repository;

import com.CoreService.CoreService.user.Entities.UserEntity;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<UserEntity,String> {
    Optional<UserEntity> findByUserIdAndCollegeId(String id,UUID collegeId);
    List<UserEntity> findAllByCollegeId(UUID collegeId);
    void deleteAllByCollegeId(UUID collegeId);
    void deleteByCollegeId(UUID collegeId);
    boolean existsByUserId(@NotBlank String userid);
    boolean existsByCollegeIdAndUserId(UUID collegeId, String userId);
    List<UserEntity> findByCollegeIdAndUserIdContainingIgnoreCaseOrCollegeIdAndUserNameContainingIgnoreCaseOrCollegeIdAndEmailContainingIgnoreCase(
            UUID collegeId1,
            String userId,
            UUID collegeId2,
            String userName,
            UUID collegeId3,
            String email
    );
    boolean existsByEmail(String email);
}
