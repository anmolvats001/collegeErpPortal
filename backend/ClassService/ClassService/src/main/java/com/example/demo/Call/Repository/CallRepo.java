package com.example.demo.Call.Repository;

import com.example.demo.Call.Entity.Call;
import com.example.demo.Call.Entity.CallStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CallRepo
        extends JpaRepository<Call, UUID> {

    Optional<Call> findByIdAndCollegeId(
            UUID callId,
            UUID collegeId
    );

    Optional<Call> findByJoinCodeAndCollegeId(
            String joinCode,
            UUID collegeId
    );

    boolean existsByJoinCode(
            String joinCode
    );

    Optional<Call> findByJoinCode(
            String joinCode
    );

}