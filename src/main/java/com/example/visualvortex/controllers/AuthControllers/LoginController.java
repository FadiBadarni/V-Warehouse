package com.example.visualvortex.controllers.AuthControllers;

import com.example.visualvortex.dtos.UserDTOS.LoginDto;
import com.example.visualvortex.dtos.UserDTOS.UserDTO;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.repositories.UserRepository;
import com.example.visualvortex.services.User.JwtUtil;
import com.example.visualvortex.services.User.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class LoginController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto credentials) {
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

            UserDTO userDTO = createUserDTO(user);
            Map<String, Object> response = createResponse(token, userDTO);
            return ResponseEntity.ok(response);

        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired. Please login again.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
    private UserDTO createUserDTO(User user) {
        return UserDTO.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .year(user.getYear())
                .build();
    }

    private Map<String, Object> createResponse(String token, UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userInfo", userDTO);
        return response;
    }
}
