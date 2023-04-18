package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;

    @GetMapping("/userInfo/{id}")
    @ResponseStatus(HttpStatus.OK)
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}