package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Notifications;
import com.example.visualvortex.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationsRepository extends JpaRepository<Notifications, Long> {
    List<Notifications> findByUser(User user);

    List<Notifications> findByUserId(Long userId);
}
