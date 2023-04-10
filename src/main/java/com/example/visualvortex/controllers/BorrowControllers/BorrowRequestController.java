package com.example.visualvortex.controllers.BorrowControllers;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.dtos.ScheduleDTO;
import com.example.visualvortex.services.BorrowRequestService;
import lombok.RequiredArgsConstructor;
import com.example.visualvortex.services.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;
    private final FirebaseService firebaseService;
    @GetMapping("/borrow-requests")
    @ResponseStatus(HttpStatus.OK)
    public List<BorrowRequestDTO> getAllRequests() {
        return borrowRequestService.getAllRequests();
    }

    @GetMapping("/borrow-requests/pending/{itemInstanceId}")
    @ResponseStatus(HttpStatus.OK)
    public List<BorrowRequestDTO> getPendingRequestsByItemInstance(@PathVariable Long itemInstanceId) {
        return borrowRequestService.getPendingRequestsByItemInstance(itemInstanceId);
    }

    @PostMapping("/borrow-requests")
    public ResponseEntity<BorrowRequestDTO> createBorrowRequest(@RequestBody BorrowRequestDTO borrowRequestDTO) {
        Optional<String> idOptional = firebaseService.save(borrowRequestDTO.getSignatureData());

        if (idOptional.isPresent()) {
            String id = idOptional.get();
            borrowRequestDTO.setSignatureData(id);
            BorrowRequestDTO newBorrowRequestDTO = borrowRequestService.createBorrowRequest(borrowRequestDTO);
            return new ResponseEntity<>(newBorrowRequestDTO, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/borrow-requests/occupied-dates")
    public ResponseEntity<List<ScheduleDTO>> getAllRelevantDates(@RequestParam("itemInstanceIds") List<Long> itemInstanceIds) {
        List<ScheduleDTO> relevantDates = borrowRequestService.getAllOccupiedDatesByItemInstances(itemInstanceIds);
        return new ResponseEntity<>(relevantDates, HttpStatus.OK);
    }

    @GetMapping("/borrow-requests/{requestId}/instances")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemInstanceDTO> getItemInstancesByRequestId(@PathVariable UUID requestId) {
        return borrowRequestService.getItemInstancesByRequestId(requestId);
    }

}
