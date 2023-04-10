package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.visualvortex.services.EmailService;

import javax.mail.MessagingException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class ImportUsersController {
    private final UserService userService;

    @PostMapping("/importUsers")
    public void importUsers(@RequestParam("file") MultipartFile file) {
        userService.importUsers(file);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
         userService.updateRoleInUserId(id,newRole);
        return ResponseEntity.ok("User role updated successfully");
    }


    @PutMapping("/create-user")
    public   void createUser(@RequestBody Map<String, String> request) {
            String recipient = request.get("recipient");
           String role = request.get("role");
           int year = Integer.parseInt(request.get("year"));
           userService.createUser(recipient,role,year);
    }

    @PutMapping("delete-user/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }



}
