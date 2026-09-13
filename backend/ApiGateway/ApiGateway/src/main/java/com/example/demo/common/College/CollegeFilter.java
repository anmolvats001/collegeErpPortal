package com.example.demo.common.College;

import com.example.demo.common.context.CollegeContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class CollegeFilter extends OncePerRequestFilter {

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

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String collegeHeader = request.getHeader("CollegeId");

        try {
            if (collegeHeader != null && !collegeHeader.isBlank()) {
                UUID collegeId;
                try {
                    collegeId = UUID.fromString(collegeHeader);
                } catch (IllegalArgumentException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Invalid CollegeId header\"}");
                    return;
                }
                CollegeContext.setCollegeId(collegeId);
            }

            filterChain.doFilter(request, response);

        } finally {
            CollegeContext.clear();
        }
    }
}
