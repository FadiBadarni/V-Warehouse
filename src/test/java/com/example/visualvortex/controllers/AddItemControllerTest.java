package com.example.visualvortex.controllers;

import com.example.visualvortex.dtos.ItemDTO;
import com.example.visualvortex.services.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AddItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ItemService itemService;

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAddItem() throws Exception {
        // Define the input and expected output
        ItemDTO inputDto = new ItemDTO();
        inputDto.setName("Test Item");
        inputDto.setDescription("Test Description");
        inputDto.setQuantity(10);
//        inputDto.setType("Test Type");
//        inputDto.setSafetyInstructions("Test Safety Instructions");
//        inputDto.setAccompanyingEquipment("Test Accompanying Equipment");

        // Perform the request and check the response
        mockMvc.perform(post("/admin/add-item")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk());

        // Verify that the saveInventoryItem method was called once
        verify(itemService, times(1)).saveItem(inputDto);
    }
}