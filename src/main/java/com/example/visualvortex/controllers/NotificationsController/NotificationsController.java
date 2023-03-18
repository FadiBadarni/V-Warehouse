package com.example.visualvortex.controllers.NotificationsController;

import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.Notifications;
import com.example.visualvortex.services.NotificationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NotificationsController {
    @Autowired
    private NotificationsService notificationsService;

    @PostMapping("/notifications")
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO newNotificationDTO = notificationsService.createNotification(notificationDTO);
        return new ResponseEntity<>(newNotificationDTO, HttpStatus.CREATED);
    }

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
}
