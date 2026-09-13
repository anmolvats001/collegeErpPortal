package com.example.demo.Chat.Interceptor;

import com.example.demo.common.JWT.JwtService;
import com.example.demo.common.context.CollegeContext;
import com.example.demo.common.context.UserContext;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        /*
         * =========================
         * STOMP CONNECT
         * =========================
         */
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authorization =
                    accessor.getFirstNativeHeader("Authorization");

            if (authorization == null ||
                    !authorization.startsWith("Bearer ")) {

                throw new RuntimeException(
                        "Missing Authorization header"
                );
            }

            String token =
                    authorization.substring(7);

            if (!jwtService.isTokenValid(token)) {

                throw new RuntimeException(
                        "Invalid or expired token"
                );
            }

            Claims claims =
                    jwtService.extractAllClaims(token);

            String userId =
                    claims.getSubject();

            if (userId == null || userId.isBlank()) {
                throw new RuntimeException(
                        "User ID missing from token"
                );
            }

            /*
             * CollegeId comes from STOMP header.
             */
            String collegeHeader =
                    accessor.getFirstNativeHeader("CollegeId");

            if (collegeHeader == null ||
                    collegeHeader.isBlank()) {

                throw new RuntimeException(
                        "CollegeId header is required"
                );
            }

            UUID collegeId;

            try {

                collegeId =
                        UUID.fromString(collegeHeader);

            } catch (IllegalArgumentException e) {

                throw new RuntimeException(
                        "Invalid CollegeId"
                );
            }

            /*
             * Validate CollegeId against JWT.
             */
            String tokenCollegeId =
                    claims.get("collegeId", String.class);

            if (tokenCollegeId == null) {

                throw new RuntimeException(
                        "College ID missing from token"
                );
            }

            UUID jwtCollegeId;

            try {

                jwtCollegeId =
                        UUID.fromString(tokenCollegeId);

            } catch (IllegalArgumentException e) {

                throw new RuntimeException(
                        "Invalid College ID in token"
                );
            }

            if (!collegeId.equals(jwtCollegeId)) {

                throw new RuntimeException(
                        "College does not match JWT"
                );
            }

            /*
             * Store authenticated identity
             * in STOMP session.
             */
            ChatPrincipal principal =
                    new ChatPrincipal(
                            userId,
                            collegeId
                    );

            accessor.setUser(principal);

            return message;
        }

        /*
         * =========================
         * EVERY OTHER STOMP MESSAGE
         * =========================
         *
         * Example:
         * /app/chat.send
         */
        if (accessor.getUser() instanceof ChatPrincipal principal) {

            UserContext.setUserId(
                    principal.getUserId()
            );

            CollegeContext.setCollegeId(
                    principal.getCollegeId()
            );
        }

        return message;
    }
}