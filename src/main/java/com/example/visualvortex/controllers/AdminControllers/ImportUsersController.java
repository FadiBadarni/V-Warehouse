package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class ImportUsersController {
    private final UserService userService;

    @PostMapping("/importUsers")
    public ResponseEntity<?> importUsers(@RequestParam("file") MultipartFile file) {
        userService.importUsers(file);
        return ResponseEntity.ok("Users imported successfully");
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
         userService.updateRoleInUserId(id,newRole);
        return ResponseEntity.ok("User role updated successfully");
    }

    @PutMapping("/update-user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String username = (String) request.get("username");
        String role = (String) request.get("role");
        Integer year = (Integer) request.get("year");
        userService.updateUser(id, email, username, role, year);
        return ResponseEntity.ok("User updated successfully");
    }

    @PutMapping("/create-user")
    public   void createUser(@RequestBody Map<String, String> request) {
            String recipient = request.get("recipient");
           String role = request.get("role");
           int year = Integer.parseInt(request.get("year"));
           userService.createUser(recipient,role,year);
    }

    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok("User deleted successfully");
    }



}
