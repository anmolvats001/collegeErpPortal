package com.example.admission.common.jwt;

import com.example.admission.common.context.CollegeContext;
import com.example.admission.common.context.UserContext;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwt;

    public JwtFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/admission/public/")
                || path.equals("/error")
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest r, HttpServletResponse s, FilterChain c)
            throws ServletException, IOException {
        String h = r.getHeader("Authorization");
        if (h == null || !h.startsWith("Bearer ")) {
            c.doFilter(r, s);
            return;
        }

        try {
            String t = h.substring(7);
            if (!jwt.isTokenValid(t)) {
                c.doFilter(r, s);
                return;
            }

            Claims cl = jwt.extractAllClaims(t);
            String uid = cl.getSubject();
            List<String> roles = cl.get("roles", List.class);
            List<String> perms = cl.get("permissions", List.class);
            List<String> mods = cl.get("modules", List.class);

            boolean main = roles != null && roles.contains("MAIN_ADMIN");
            if (!main) {
                String cv = cl.get("collegeId", String.class);
                if (cv == null || CollegeContext.getCollegeId() == null) {
                    s.sendError(403, "CollegeId header is required");
                    return;
                }
                if (!UUID.fromString(cv).equals(CollegeContext.getCollegeId())) {
                    s.sendError(403, "College does not match token");
                    return;
                }
            }

            UserContext.setUserId(uid);
            List<GrantedAuthority> a = new ArrayList<>();
            if (roles != null) roles.forEach(x -> a.add(new SimpleGrantedAuthority("ROLE_" + x)));
            if (perms != null) perms.forEach(x -> a.add(new SimpleGrantedAuthority(x)));
            if (mods != null) mods.forEach(x -> a.add(new SimpleGrantedAuthority("MODULE_" + x)));

            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(uid, null, a));
            c.doFilter(r, s);
        } finally {
            UserContext.clear();
            SecurityContextHolder.clearContext();
        }
    }
}
