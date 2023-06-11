package com.example.visualvortex.IntegrationTests;

import com.example.visualvortex.services.User.JwtUtil;
import com.example.visualvortex.services.User.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class LoginIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    private String token;

    @BeforeEach
    void setUp() {
        UserDetails userDetails = new User("testUser", PasswordEncoderFactories.createDelegatingPasswordEncoder().encode("testPass"), Collections.emptyList());
        token = "testToken";

        when(userService.authenticateUser("testUser", "testPass")).thenReturn(java.util.Optional.of(userDetails));
        when(userService.generateToken(userDetails)).thenReturn(token);
    }

    @Test
    public void testLogin() throws Exception {
        String jsonLoginDto = "{ \"username\": \"testUser\", \"password\": \"testPass\" }";

        this.mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonLoginDto))
                .andExpect(status().isOk());
    }

    @Test
    public void testLoginFailed() throws Exception {
        String jsonLoginDto = "{ \"username\": \"wrongUser\", \"password\": \"wrongPass\" }";

        when(userService.authenticateUser("wrongUser", "wrongPass")).thenReturn(java.util.Optional.empty());

        this.mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonLoginDto))
                .andExpect(status().isUnauthorized());
    }
}
