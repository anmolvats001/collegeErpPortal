package com.example.demo.common.JWT;

import com.example.demo.common.context.UserContext;
import com.example.demo.common.context.CollegeContext;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/admission/public/")
                || path.startsWith("/api/v1/core/public/")
                || path.startsWith("/api/v1/core/auth/")
                || path.startsWith("/api/files/")
                || path.startsWith("/api/notifications/")
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    private final JwtService jwtService;

    @Autowired
    private UserContext userContext;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            // Validate JWT
            if (!jwtService.isTokenValid(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extract claims
            Claims claims = jwtService.extractAllClaims(token);

            String username = claims.getSubject();

            List<String> roles = claims.get("roles", List.class);
            List<String> permissions = claims.get("permissions", List.class);
            List<String> modules = claims.get("modules", List.class);

            // Check if Main Admin
            boolean isMainAdmin = roles != null && roles.contains("MAIN_ADMIN".toUpperCase());

            // Validate college only for non-main-admin users
            if (!isMainAdmin) {

                String collegeIdStr = claims.get("collegeId", String.class);

                if (collegeIdStr == null) {
                    throw new RuntimeException("College ID missing in token");
                }

                UUID collegeId = UUID.fromString(collegeIdStr);

                if (!collegeId.equals(CollegeContext.getCollegeId())) {
                    throw new RuntimeException("User does not belong to this college");
                }

                userContext.setCollegeId(collegeId);
            }
            UserContext.setUserId(username);
            // Create authorities
            List<GrantedAuthority> authorities = new ArrayList<>();

            if (roles != null) {
                roles.forEach(role ->
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role)));
            }
            if (permissions != null) {
                permissions.forEach(permission ->

                        authorities.add(new SimpleGrantedAuthority(permission)));
            }

            if (modules != null) {
                modules.forEach(module ->
                        authorities.add(new SimpleGrantedAuthority("MODULE_" + module)));
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username
                                ,
                                null,
                                authorities
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(request, response);

        } finally {
            CollegeContext.clear();
            UserContext.clear(); // Ensure this clears all ThreadLocal values
        }
    }
}