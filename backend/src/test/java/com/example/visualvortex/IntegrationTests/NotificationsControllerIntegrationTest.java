package com.example.visualvortex.IntegrationTests;

import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.services.NotificationsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class NotificationsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationsService notificationsService;

    @Test
    @WithMockUser
    public void shouldFetchUserNotifications() throws Exception {
        Long userId = 1L;
        NotificationDTO notificationDTO = new NotificationDTO(1L, "message", LocalDateTime.now(), userId, false);
        List<NotificationDTO> notifications = List.of(notificationDTO);

        Mockito.when(notificationsService.getUserNotifications(userId)).thenReturn(notifications);

        this.mockMvc.perform(get("/api/notifications/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(Math.toIntExact(notificationDTO.getId()))))
                .andExpect(jsonPath("$[0].message", is(notificationDTO.getMessage())));

        Mockito.verify(notificationsService, times(1)).getUserNotifications(userId);
    }

    @Test
    @WithMockUser
    public void shouldClearUserNotifications() throws Exception {
        Long userId = 1L;
        Mockito.doNothing().when(notificationsService).clearUserNotifications(userId);

        this.mockMvc.perform(delete("/api/notifications/" + userId))
                .andExpect(status().isNoContent());

        Mockito.verify(notificationsService, times(1)).clearUserNotifications(userId);
    }

    @Test
    @WithMockUser
    public void shouldMarkUserNotificationsAsRead() throws Exception {
        Long userId = 1L;
        Mockito.doNothing().when(notificationsService).markUserNotificationsAsRead(userId);

        this.mockMvc.perform(put("/api/notifications/read/" + userId))
                .andExpect(status().isOk());

        Mockito.verify(notificationsService, times(1)).markUserNotificationsAsRead(userId);
    }




}
