package com.example.visualvortex.controllers.UserControllers;

import com.example.visualvortex.dtos.InventoryItemDTO;
import com.example.visualvortex.dtos.UserDTO;
import com.example.visualvortex.entities.InventoryItem;
import com.example.visualvortex.entities.User;
import com.example.visualvortex.repositories.UserRepository;
import com.example.visualvortex.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;


@RestController
@RequestMapping("/api/v1")
public class UserInfoController {
    @Autowired
    private UserService userService;


    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findUserByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setUsername(user.getUsername());
        userDTO.setYear(user.getYear());
        userDTO.setRole(user.getRole());

        return ResponseEntity.ok(userDTO);
    }




}