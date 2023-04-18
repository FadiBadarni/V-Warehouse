package com.example.visualvortex.controllers.AuthControllers;

import com.example.visualvortex.dtos.UserDTOS.LoginDto;
import com.example.visualvortex.dtos.UserDTOS.UserDTO;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.services.User.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class LoginController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody @Valid LoginDto credentials) {
        return userService.authenticateUser(credentials.getUsername(), credentials.getPassword())
                .map(userDetails -> {
                    String token = userService.generateToken(userDetails);
                    UserDTO userDTO = userService.createUserDTO((User) userDetails);
                    return ResponseEntity.ok(userService.createResponse(token, userDTO));
                })
                .orElseGet(this::unauthorizedResponse);
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    private ResponseEntity<Map<String, Object>> unauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }
}