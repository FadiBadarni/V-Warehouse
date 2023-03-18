package com.example.visualvortex.controllers.AuthControllers;

import com.example.visualvortex.dtos.RegistrationDto;
import com.example.visualvortex.errors.PasswordDoNotMatchs;
import com.example.visualvortex.errors.UserAlreadyExists;
import com.example.visualvortex.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationDto data) {
        try {
            if (!data.getPassword().equals(data.getConfirmPassword())) {
                throw new PasswordDoNotMatchs();
            }

            userService.registerUser(data.getEmail(), data.getPassword());
            return ResponseEntity.ok().build();
        } catch (PasswordDoNotMatchs ex) {
            return ResponseEntity.badRequest().body("Passwords do NOT match!");
        } catch (UserAlreadyExists ex) {
            return ResponseEntity.badRequest().body("User already exists!");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Failed to register user!");
        }
    }
}
