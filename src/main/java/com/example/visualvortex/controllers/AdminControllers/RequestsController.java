package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.entities.BorrowRequest;
import com.example.visualvortex.entities.RequestStatus;
import com.example.visualvortex.services.BorrowRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class RequestsController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @GetMapping("/borrow-requests")
    public ResponseEntity<List<BorrowRequestDTO>> getAllRequests(){
        List<BorrowRequest> requests = borrowRequestService.getAllRequests();
        List<BorrowRequestDTO> requestDTOS = requests.stream().map(this::toDTO).collect(Collectors.toList());
        return new ResponseEntity<>(requestDTOS, HttpStatus.OK);
    }

    @PutMapping("/borrow-requests/{requestId}")
    public ResponseEntity<BorrowRequestDTO> updateRequestStatus(@PathVariable UUID requestId, @RequestParam RequestStatus status) {
        BorrowRequestDTO updatedRequest = borrowRequestService.updateRequestStatus(requestId, status);
        return ResponseEntity.ok(updatedRequest);
    }

    private BorrowRequestDTO toDTO(BorrowRequest request) {
        return BorrowRequestDTO.builder()
                .requestId(request.getRequestId())
                .userId(request.getUserId())
                .itemId(request.getItemId())
                .intendedStartDate(request.getIntendedStartDate())
                .intendedReturnDate(request.getIntendedReturnDate())
                .borrowingReason(request.getBorrowingReason())
                .quantity(request.getQuantity())
                .sentRequestTime(request.getSentRequestTime())
                .status(request.getStatus())
                .build();
    }

}
