package com.example.visualvortex.IntegrationTests;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.entities.Request.RequestStatus;
import com.example.visualvortex.services.BorrowRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.times;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class RequestsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BorrowRequestService borrowRequestService;

    @Test
    @WithMockUser(authorities = "ADMIN")
    public void shouldFetchAllRequests() throws Exception {
        BorrowRequestDTO borrowRequestDTO = BorrowRequestDTO.builder()
                .intendedStartDate(LocalDateTime.now().plusDays(5))
                .intendedReturnDate(LocalDateTime.now().plusDays(10))
                .requestTime(LocalDateTime.now())
                .borrowingReason("Borrowing for testing purposes")
                .userId(1L)
                .itemIds(Collections.singletonList(1L))
                .signatureData("SignatureData")
                .status(RequestStatus.PENDING)
                .requestId(UUID.randomUUID())
                .itemInstanceIds(Collections.singletonList(1L))
                .build();

        List<BorrowRequestDTO> borrowRequests = List.of(borrowRequestDTO);

        Mockito.when(borrowRequestService.getAllRequests()).thenReturn(borrowRequests);

        this.mockMvc.perform(get("/admin/borrow-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].requestId", is(borrowRequestDTO.getRequestId().toString())));

        Mockito.verify(borrowRequestService, times(1)).getAllRequests();
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    public void shouldUpdateRequestStatus() throws Exception {
        UUID requestId = UUID.randomUUID();
        RequestStatus status = RequestStatus.AWAITING_PICKUP;

        BorrowRequestDTO borrowRequestDTO = BorrowRequestDTO.builder()
                .intendedStartDate(LocalDateTime.now().plusDays(5))
                .intendedReturnDate(LocalDateTime.now().plusDays(10))
                .requestTime(LocalDateTime.now())
                .borrowingReason("Borrowing for testing purposes")
                .userId(1L)
                .itemIds(Collections.singletonList(1L))
                .signatureData("SignatureData")
                .status(status)
                .requestId(requestId)
                .itemInstanceIds(Collections.singletonList(1L))
                .build();

        Mockito.when(borrowRequestService.updateRequestStatus(requestId, status)).thenReturn(borrowRequestDTO);

        this.mockMvc.perform(put("/admin/borrow-requests/" + requestId.toString()).param("status", status.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestId", is(borrowRequestDTO.getRequestId().toString())));

        Mockito.verify(borrowRequestService, times(1)).updateRequestStatus(requestId, status);
    }
}
