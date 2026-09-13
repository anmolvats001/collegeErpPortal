package com.CoreService.CoreService.auth.Services;

import com.CoreService.CoreService.auth.Entities.RefreshToken;
import com.CoreService.CoreService.auth.Repositories.RefreshTokenRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepo refreshTokenRepo;

    public RefreshToken generateRefreshToken(String userId) {
        RefreshToken refreshToken = RefreshToken.builder().userId(userId).expiresAt(Instant.now().plus(30, ChronoUnit.DAYS)
).build();
        refreshTokenRepo.save(refreshToken);
        return refreshToken;
    }
    public boolean checkExpiration(RefreshToken refreshToken) {
        Instant now = Instant.now();
        Instant expiresAt = refreshToken.getExpiresAt();
        if (now.isAfter(expiresAt)) {
            refreshTokenRepo.deleteById(refreshToken.getId());
            return true;
        }
        return false;
    }

}
