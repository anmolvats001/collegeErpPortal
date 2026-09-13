package com.example.fee.common.JWT;

import com.example.fee.common.context.CollegeContext;
import com.example.fee.common.context.UserContext;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        /*
         * No JWT → continue.
         * SecurityConfig will decide whether authentication is required.
         */
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            // Validate token
            if (!jwtService.isTokenValid(token)) {

                filterChain.doFilter(request, response);
                return;
            }

            // Extract JWT claims
            Claims claims = jwtService.extractAllClaims(token);

            String userId = claims.getSubject();

            List<String> roles =
                    claims.get("roles", List.class);

            List<String> permissions =
                    claims.get("permissions", List.class);

            List<String> modules =
                    claims.get("modules", List.class);

            /*
             * Check whether this is MAIN_ADMIN.
             *
             * MAIN_ADMIN may not have a college restriction.
             */
            boolean isMainAdmin =
                    roles != null &&
                            roles.contains("MAIN_ADMIN");

            /*
             * College users must belong to the
             * college specified by the CollegeId header.
             */
            if (!isMainAdmin) {

                String collegeIdString =
                        claims.get("collegeId", String.class);

                if (collegeIdString == null ||
                        collegeIdString.isBlank()) {

                    throw new RuntimeException(
                            "College ID missing in JWT"
                    );
                }

                UUID tokenCollegeId =
                        UUID.fromString(collegeIdString);

                UUID requestCollegeId =
                        CollegeContext.getCollegeId();

                if (requestCollegeId == null) {

                    throw new RuntimeException(
                            "CollegeId header missing"
                    );
                }

                if (!tokenCollegeId.equals(requestCollegeId)) {

                    throw new RuntimeException(
                            "User does not belong to this college"
                    );
                }

                UserContext.setCollegeId(tokenCollegeId);
            } else {
                if (CollegeContext.getCollegeId() != null) {
                    UserContext.setCollegeId(CollegeContext.getCollegeId());
                }
            }

            // Store logged-in user
            UserContext.setUserId(userId);

            /*
             * Create Spring Security authorities.
             */
            List<GrantedAuthority> authorities =
                    new ArrayList<>();

            // Roles
            if (roles != null) {

                for (String role : roles) {

                    authorities.add(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            )
                    );
                }
            }

            // Permissions
            if (permissions != null) {

                for (String permission : permissions) {

                    authorities.add(
                            new SimpleGrantedAuthority(
                                    permission
                            )
                    );
                }
            }

            /*
             * Modules
             *
             * If JWT contains:
             *
             * modules = ["FEE"]
             *
             * authority becomes:
             *
             * MODULE_FEE
             */
            if (modules != null) {

                for (String module : modules) {

                    authorities.add(
                            new SimpleGrantedAuthority(
                                    "MODULE_" + module
                            )
                    );
                }
            }

            /*
             * Create authentication object.
             */
            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                authorities
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            e.printStackTrace();

            /*
             * Invalid JWT / invalid college.
             * Let Spring Security handle the unauthenticated request.
             */
            SecurityContextHolder
                    .clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

        } finally {

            CollegeContext.clear();
            UserContext.clear();
        }
    }
}