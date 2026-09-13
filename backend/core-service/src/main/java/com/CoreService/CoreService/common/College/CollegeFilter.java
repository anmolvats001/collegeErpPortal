package com.CoreService.CoreService.common.College;

import com.CoreService.CoreService.common.context.CollegeContext;
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
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String collegeHeader = request.getHeader("CollegeId");

        try {
            if (collegeHeader != null && !collegeHeader.isBlank()) {
                UUID collegeId = UUID.fromString(collegeHeader);
                CollegeContext.setCollegeId(collegeId);
            }

            filterChain.doFilter(request, response);

        } finally {
            CollegeContext.clear();
        }
    }
}
