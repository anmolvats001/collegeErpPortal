package com.CoreService.CoreService.auth.Repositories;

import com.CoreService.CoreService.auth.Entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RefreshTokenRepo extends JpaRepository<RefreshToken,String> {

}
