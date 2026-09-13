package com.example.notification.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:campusconnect743@gmail.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String recipientEmail, String subject, String message) {
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setFrom(fromEmail);
        emailMessage.setTo(recipientEmail);
        emailMessage.setSubject(subject);
        emailMessage.setText(message);
        mailSender.send(emailMessage);
    }
}
