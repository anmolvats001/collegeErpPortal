package com.example.demo.notification;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class NotificationProducer {

    private static final String TOPIC = "notification-events";

    private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;

    public void send(String recipientEmail, String subject, String message) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return;
        }

        NotificationEvent event = new NotificationEvent(subject, message);

        ProducerRecord<String, NotificationEvent> record =
                new ProducerRecord<>(TOPIC, event);
        record.headers().add(
                "email",
                recipientEmail.trim().getBytes(StandardCharsets.UTF_8)
        );

        kafkaTemplate.send(record);
    }
}
