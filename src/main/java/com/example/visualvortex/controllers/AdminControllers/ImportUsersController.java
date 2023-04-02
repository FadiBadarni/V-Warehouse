package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class ImportUsersController {
    private final UserService userService;
    @PostMapping("/importUsers")
    public void importUsers(@RequestParam("file") MultipartFile file) {
        userService.importUsers(file);
    }
}
