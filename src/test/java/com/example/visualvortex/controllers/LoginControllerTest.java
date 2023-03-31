package com.example.visualvortex.controllers;

import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.entities.User.UserRole;
import com.example.visualvortex.services.User.UserService;
import com.example.visualvortex.services.User.JwtUtil;
import com.example.visualvortex.repositories.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @Test
    void testLogin() throws Exception {
        // Define the input and expected output
        String inputJson = "{\"username\":\"testuser\", \"password\":\"testpassword\"}";
        String expectedToken = "sample_token";
        String expectedResponse = "{\"token\":\"sample_token\",\"userInfo\":{\"email\":\"testuser@example.com\",\"username\":\"testuser\",\"year\":2023}}";

        // Mock the behavior of userService, jwtUtil, and userRepository
        when(userService.authenticateUser("testuser", "testpassword")).thenReturn(true);
        when(userService.loadUserByUsername("testuser")).thenReturn(new org.springframework.security.core.userdetails.User("testuser", "testpassword", new ArrayList<>()));
        when(jwtUtil.generateToken(any())).thenReturn(expectedToken);

        User testUser = User.builder()
                .email("testuser@example.com")
                .username("testuser")
                .year(2023)
                .password("testpassword")
                .role(UserRole.USER)
                .build();

        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Perform the request and check the response
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inputJson))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse));
    }
}