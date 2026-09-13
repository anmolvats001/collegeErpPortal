package com.example.notification.service;

import com.example.notification.dto.NotificationEvent;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class NotificationConsumerService {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumerService.class);
    private final EmailService emailService;

    public NotificationConsumerService(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(
            topics = "notification-events",
            groupId = "notification-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeNotificationEvent(
            ConsumerRecord<String, NotificationEvent> record) {

        Header emailHeader = record.headers().lastHeader("email");

        if (emailHeader == null) {
            log.warn("Email header is missing in Kafka record from topic '{}'.", record.topic());
            return;
        }

        String recipientEmail = new String(
                emailHeader.value(),
                StandardCharsets.UTF_8
        ).trim();

        NotificationEvent notificationEvent = record.value();

        if (notificationEvent == null) {
            log.warn("Notification event payload is missing for recipient '{}'.", recipientEmail);
            return;
        }

        log.info("Processing notification event for: {}", recipientEmail);

        try {
            emailService.sendEmail(
                    recipientEmail,
                    notificationEvent.getSubject(),
                    notificationEvent.getMessage()
            );
            log.info("Notification email successfully sent to: {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send notification email to '{}': {}", recipientEmail, e.getMessage(), e);
        }
    }
}
