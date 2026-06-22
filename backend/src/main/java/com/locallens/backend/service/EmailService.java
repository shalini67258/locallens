
package com.locallens.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to LocalLens! 🌍");
        message.setText("Hi " + name + ",\n\nWelcome to LocalLens — your hyperlocal community alert network!\n\n" +
                "You'll now get real-time updates and emergency alerts for your area.\n\n" +
                "Stay informed, stay safe.\n\n- The LocalLens Team");
        mailSender.send(message);
    }

    public void sendEmergencyAlert(String toEmail, String area, String content, String category) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🚨 LocalLens Alert: " + category + " in " + area);
        message.setText("A new " + category + " update was reported in your area (" + area + "):\n\n" +
                content + "\n\nStay safe and informed with LocalLens.");
        mailSender.send(message);
    }
}