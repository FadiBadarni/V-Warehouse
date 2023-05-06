package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.services.BorrowRequestService;
import com.example.visualvortex.services.NotificationsService;
import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final NotificationsService notificationsService;
    private final BorrowRequestService borrowRequestService;

    @GetMapping("/userInfo/{id}")
    @ResponseStatus(HttpStatus.OK)
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> broadcastNotificationToAllUsers(@RequestParam("message") String message) {
        String prefix = "System Message : ";
        notificationsService.broadcastNotificationToAllUsers(prefix + message);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/borrow-additemInstances/{requestId}")
    @ResponseStatus(HttpStatus.OK)
    public void borrowAddItemInstances(@PathVariable UUID requestId, @RequestParam List<Long> itemInstances) {
        System.out.println(requestId);
        System.out.println(itemInstances);
        borrowRequestService.borrowAddItemInstances(requestId, itemInstances);
    }
}
