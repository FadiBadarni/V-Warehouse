package com.example.visualvortex.services;

import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    public void sendEmailAsync(String recipient, String subject, String body) {
        CompletableFuture.runAsync(() -> {
            sendEmail(recipient, subject, body);
        });
    }

    public void sendEmail(String recipient,String subject,String body)  {

        // Set up properties for the mail session
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        // Create a new session with an authenticator
        Authenticator auth = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("testmyapp1020@gmail.com", "yvqhepqxxkvfpqxs");

            }
        };
        Session session = Session.getInstance(props, auth);

        // Create a new message
        Message message = new MimeMessage(session);
        try {
            message.setFrom(new InternetAddress("testmyapp1020@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
            message.setSubject(subject);
            message.setText(body);

            // Send the message
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }
}