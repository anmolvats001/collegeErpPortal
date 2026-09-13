package com.CoreService.CoreService.common.JWT;


import com.CoreService.CoreService.common.DTO.JwtDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;


@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {

        try {

            Claims claims = extractAllClaims(token);

            return claims.getExpiration().after(new Date());

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String generateJwtToken(JwtDto jwtDto) {

        return Jwts.builder()
                .subject(jwtDto.getUserId())
                .claim("collegeId", jwtDto.getCollegeId())
                .claim("roles", jwtDto.getRoles())
                .claim("permissions", jwtDto.getPermissions())
                .claim("modules", jwtDto.getModules())

                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // 1 hour

                .signWith(getSigningKey())
                .compact();
    }
}