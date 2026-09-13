package com.example.admission.common.college;

import com.example.admission.common.context.CollegeContext;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.*;
import java.util.UUID;

@Component
public class CollegeFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/admission/public/")
                || path.equals("/error")
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    protected void doFilterInternal(HttpServletRequest r, HttpServletResponse s, FilterChain c) throws ServletException, IOException {
        try {
            String h = r.getHeader("CollegeId");
            if (h != null && !h.isBlank()) CollegeContext.setCollegeId(UUID.fromString(h));
            c.doFilter(r, s);
        } finally {
            CollegeContext.clear();
        }
    }
}
