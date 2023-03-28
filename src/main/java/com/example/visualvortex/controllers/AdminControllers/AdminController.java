package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.dtos.UserDTO;
import com.example.visualvortex.entities.User;
import com.example.visualvortex.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPage() {
        return ResponseEntity.ok("You've reached the admin endpoint!");
    }

    @GetMapping("/userInfo/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        UserDTO userDTO = toDTO(user);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    private UserDTO toDTO(Optional<User> user) {
        UserDTO userDTO = new UserDTO();
        if (user.isPresent()){
            userDTO.setId(user.get().getId());
            userDTO.setEmail(user.get().getEmail());
            userDTO.setUsername(user.get().getUsername());
            userDTO.setYear(user.get().getYear());
            userDTO.setRole(user.get().getRole());
        }
        return userDTO;
    }
}
