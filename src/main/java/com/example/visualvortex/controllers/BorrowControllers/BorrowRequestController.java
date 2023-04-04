package com.example.visualvortex.controllers.BorrowControllers;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.services.BorrowRequestService;
import com.example.visualvortex.services.FirbaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @Autowired
    private FirbaseService firbaseService;

    @PostMapping("/borrow-requests")
    public ResponseEntity<BorrowRequestDTO> createBorrowRequest(@RequestBody BorrowRequestDTO borrowRequestDTO) {
            String id=firbaseService.Save(borrowRequestDTO.getSignatureData());
        borrowRequestDTO.setSignatureData(id);
        BorrowRequestDTO newBorrowRequestDTO = borrowRequestService.createBorrowRequest(borrowRequestDTO);
        return new ResponseEntity<>(newBorrowRequestDTO, HttpStatus.CREATED);
    }

}
