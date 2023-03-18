package com.example.visualvortex.controllers.UserControllers;

import com.example.visualvortex.dtos.UserProfileDTO;
import com.example.visualvortex.entities.User;
import com.example.visualvortex.entities.UserProfile;
import com.example.visualvortex.services.UserProfileService;
import com.example.visualvortex.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1")
public class UserInfoController {

    @Autowired
    private UserProfileService userProfileService;
    @Autowired
    private UserService userService;

    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userService.findUserByEmail(userEmail).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        UserProfile userProfile = userProfileService.findUserProfileByEmail(userEmail);

        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setId(userProfile.getId());
        userProfileDTO.setEmail(userEmail);
        userProfileDTO.setFirstName(userProfile.getFirstName());
        userProfileDTO.setLastName(userProfile.getLastName());
        userProfileDTO.setAge(userProfile.getAge());
        userProfileDTO.setPicture(userProfile.getPicture());
        userProfileDTO.setRole(user.getRole());

        return ResponseEntity.ok(userProfileDTO);
    }

}