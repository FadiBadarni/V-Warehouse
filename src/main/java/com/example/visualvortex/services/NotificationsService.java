package com.example.visualvortex.services;

import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.Notifications;
import com.example.visualvortex.entities.User;
import com.example.visualvortex.repositories.NotificationsRepository;
import com.example.visualvortex.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationsService {

    @Autowired
    private NotificationsRepository notificationsRepository;

    @Autowired
    private UserRepository userRepository;

    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        User user = userRepository.findById(notificationDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + notificationDTO.getUserId()));
        Notifications notification = new Notifications();
        notification.setMessage(notificationDTO.getMessage());
        notification.setDate(notificationDTO.getDate());
        notification.setUser(user);
        Notifications savedNotification = notificationsRepository.save(notification);
        return toNotificationDTO(savedNotification);
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<Notifications> notifications = notificationsRepository.findByUserId(userId);
        return notifications.stream().map(this::toNotificationDTO).collect(Collectors.toList());
    }

    private NotificationDTO toNotificationDTO(Notifications notification) {
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setMessage(notification.getMessage());
        notificationDTO.setDate(notification.getDate());
        notificationDTO.setUserId(notification.getUser().getId());
        notificationDTO.setRead(notification.isRead());
        return notificationDTO;
    }

    public void clearUserNotifications(Long userId) {
        List<Notifications> notifications = notificationsRepository.findByUserId(userId);
        notificationsRepository.deleteAll(notifications);
    }

    public void markUserNotificationsAsRead(Long userId) {
        List<Notifications> notifications = notificationsRepository.findByUserId(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationsRepository.saveAll(notifications);
    }
}
