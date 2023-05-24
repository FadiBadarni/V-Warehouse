package com.example.visualvortex.controllers.NotificationsController;

import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.Notifications;
import com.example.visualvortex.services.NotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class NotificationsController {
    private final NotificationsService notificationsService;

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationsService.getUserNotifications(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @DeleteMapping("/notifications/{userId}")
    public ResponseEntity<Void> clearUserNotifications(@PathVariable Long userId) {
        notificationsService.clearUserNotifications(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/notifications/read/{userId}")
    public ResponseEntity<Void> markUserNotificationsAsRead(@PathVariable Long userId) {
        notificationsService.markUserNotificationsAsRead(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/sendToAdminsNotifications/{message}")
    @ResponseStatus(HttpStatus.OK)
    public void sendNotificationsToAdmins(@PathVariable String message) {
        notificationsService.sendNotificationsToAdmins(message);

    }
}
