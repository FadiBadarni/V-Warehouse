package com.example.visualvortex.controllers.AuthControllers;

import com.example.visualvortex.dtos.LoginDto;
import com.example.visualvortex.dtos.UserDTO;
import com.example.visualvortex.entities.User;
import com.example.visualvortex.repositories.UserRepository;
import com.example.visualvortex.services.JwtUtil;
import com.example.visualvortex.services.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto credentials) {

        try {
            boolean isAuthenticated = userService.authenticateUser(credentials.getUsername(), credentials.getPassword());
            if (!isAuthenticated) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
            UserDetails userDetails = userService.loadUserByUsername(credentials.getUsername());
            String token = jwtUtil.generateToken(userDetails);

            User user = userRepository.findByUsername(credentials.getUsername());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }

            UserDTO userDTO = new UserDTO();
            userDTO.setEmail(user.getEmail());
            userDTO.setUsername(user.getUsername());
            userDTO.setYear(user.getYear());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userInfo", userDTO);

            return ResponseEntity.ok(response);
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired. Please login again.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
}
