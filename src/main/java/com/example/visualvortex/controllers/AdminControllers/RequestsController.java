package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.entities.Request.RequestStatus;
import com.example.visualvortex.services.BorrowRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class RequestsController {

    private final BorrowRequestService borrowRequestService;

    @GetMapping("/borrow-requests")
    @ResponseStatus(HttpStatus.OK)
    public List<BorrowRequestDTO> getAllRequests() {
        return borrowRequestService.getAllRequests();
    }

    @PutMapping("/borrow-requests/{requestId}")
    @ResponseStatus(HttpStatus.OK)
    public BorrowRequestDTO updateRequestStatus(@PathVariable UUID requestId, @RequestParam RequestStatus status) {
        return borrowRequestService.updateRequestStatus(requestId, status);
    }

}
