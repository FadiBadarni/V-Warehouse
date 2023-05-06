package com.example.visualvortex.controllers.BorrowControllers;

import com.example.visualvortex.dtos.AvailableTime;
import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.dtos.ScheduleDTO;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.entities.Request.BorrowRequest;
import com.example.visualvortex.services.BorrowRequestService;
import com.example.visualvortex.services.Item.ItemInstanceService;
import lombok.RequiredArgsConstructor;
import com.example.visualvortex.services.FirebaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;
    private final ItemInstanceService itemInstanceService;

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
    @ResponseStatus(HttpStatus.OK)
    public BorrowRequestDTO createBorrowRequest2(@RequestBody Map<String, Object> borrowRequestData) {
        return borrowRequestService.createBorrowRequest2(borrowRequestData);
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

    @GetMapping("/items/{itemId}/instances")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemInstanceDTO> getItemInstancesByItemId(@PathVariable Long itemId) {
        List<ItemInstanceDTO> t = itemInstanceService.getItemInstancesByItemId(itemId);
        return itemInstanceService.getItemInstancesByItemId(itemId);
    }


    @PutMapping("/borrow-requests/{requestId}/cancel")
    @ResponseStatus(HttpStatus.OK)
    public void cancelBorrowRequest(@PathVariable UUID requestId) {
        borrowRequestService.cancelBorrowRequest(requestId);
    }

    @GetMapping("/borrow-requests/{requestId}/itemsIds")
    @ResponseStatus(HttpStatus.OK)
    public List<Long> getItemsIdsByRequestId(@PathVariable UUID requestId) {
        return borrowRequestService.getItemsIdsByRequestId(requestId);
    }

}