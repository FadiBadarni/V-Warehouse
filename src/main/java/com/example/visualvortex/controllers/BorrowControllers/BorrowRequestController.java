package com.example.visualvortex.controllers.BorrowControllers;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.services.BorrowRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @PostMapping("/borrow-requests")
    public ResponseEntity<BorrowRequestDTO> createBorrowRequest(@RequestBody BorrowRequestDTO borrowRequestDTO) {
        BorrowRequestDTO newBorrowRequestDTO = borrowRequestService.createBorrowRequest(borrowRequestDTO);
        return new ResponseEntity<>(newBorrowRequestDTO, HttpStatus.CREATED);
    }
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return new ResponseEntity<>("Test endpoint reached", HttpStatus.OK);
    }
}
