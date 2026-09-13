package com.example.notification.controller;

import com.example.notification.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/health")
    public String checkNotificationServiceHealth() {
        return "Notification Service is running";
    }

    @PostMapping("/test-send")
    public ResponseEntity<?> testSendEmail(
            @RequestParam String to,
            @RequestParam(defaultValue = "CampusConnect Test Email") String subject,
            @RequestParam(defaultValue = "This is a test notification from CampusConnect.") String message) {
        try {
            emailService.sendEmail(to, subject, message);
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "recipient", to,
                    "message", "Email sent successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "recipient", to,
                    "error", e.getMessage() != null ? e.getMessage() : "Unknown error"
            ));
        }
    }
}
