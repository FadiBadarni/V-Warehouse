package com.example.visualvortex.services;

import com.example.visualvortex.entities.UserProfile;
import com.example.visualvortex.errors.UserProfileNotFoundException;
import com.example.visualvortex.repositories.UserProfileRepository;
import com.example.visualvortex.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserProfile> findAll() {
        return userProfileRepository.findAll();
    }

    public UserProfile save(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    public UserProfile findUserProfileByEmail(String userEmail) {
        return userProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new UserProfileNotFoundException("UserProfile not found for email: " + userEmail));
    }
}