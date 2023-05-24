package com.example.visualvortex.controllers.UserControllers;

import com.example.visualvortex.dtos.UserDTOS.UserDTO;
import com.example.visualvortex.dtos.UserDTOS.UserNameId;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api")
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

    @GetMapping("/get_all_users_username_and_Id")
    @ResponseStatus(HttpStatus.OK)
    public Iterable<UserNameId> getAllUsers() {

        Iterable<User> users = userService.findAll();
        List<UserNameId> userNameIds = new ArrayList<>();

        for (User user : users) {
            UserNameId userNameId = new UserNameId();
            userNameId.setUsername(user.getUsername());
            userNameId.setId(user.getId());
            userNameIds.add(userNameId);
        }

        return userNameIds;
    }







}