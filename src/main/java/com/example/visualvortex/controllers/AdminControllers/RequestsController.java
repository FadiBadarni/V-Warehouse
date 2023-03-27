package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.InventoryItemDTO;
import com.example.visualvortex.entities.BorrowRequest;
import com.example.visualvortex.entities.InventoryItem;
import com.example.visualvortex.services.BorrowRequestService;
import com.example.visualvortex.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class RequestsController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @GetMapping("/requests")
    public ResponseEntity<List<BorrowRequestDTO>> getAllRequests(){
        List<BorrowRequest> requests = borrowRequestService.getAllRequests();
        List<BorrowRequestDTO> requestDTOS = requests.stream().map(this::toDTO).collect(Collectors.toList());
        return new ResponseEntity<>(requestDTOS, HttpStatus.OK);
    }


    private BorrowRequestDTO toDTO(BorrowRequest request) {
        return BorrowRequestDTO.builder()
                .userId(request.getUserId())
                .itemId(request.getItemId())
                .intendedStartDate(request.getIntendedStartDate())
                .intendedReturnDate(request.getIntendedReturnDate())
                .borrowingReason(request.getBorrowingReason())
                .quantity(request.getQuantity())
                .sentRequestTime(request.getSentRequestTime())
                .build();
    }

}
