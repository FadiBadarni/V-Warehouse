package com.example.visualvortex.services;

import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.Notifications;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.repositories.NotificationsRepository;
import com.example.visualvortex.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class NotificationsService {

    private final NotificationsRepository notificationsRepository;

    private final UserRepository userRepository;

    public void createNotification(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        Notifications notification = new Notifications();

        notification.setMessage(message);
        notification.setDate(LocalDateTime.now());
        notification.setUser(user);
        notification.setRead(false);
        Notifications savedNotification = notificationsRepository.save(notification);
        toNotificationDTO(savedNotification);
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

    public void broadcastNotificationToAllUsers(String message) {
        Iterable<User> allUsersIterable = userRepository.findAll();
        List<User> allUsers = StreamSupport.stream(allUsersIterable.spliterator(), false)
                .collect(Collectors.toList());
        allUsers.forEach(user -> createNotification(user.getId(), message));
    }


}
