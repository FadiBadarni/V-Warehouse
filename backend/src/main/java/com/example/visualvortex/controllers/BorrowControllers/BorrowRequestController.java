package com.example.visualvortex.controllers.BorrowControllers;

import com.example.visualvortex.dtos.AvailableTime;
import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.dtos.ScheduleDTO;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.entities.Request.BorrowRequest;
import com.example.visualvortex.services.BorrowRequestService;
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

    @GetMapping("/borrow-requests/pendingByItemId/{itemId}")
    @ResponseStatus(HttpStatus.OK)
    public List<BorrowRequest> getPendingRequestsByItemId(@PathVariable Long itemId) {
        return borrowRequestService.getPendingRequestsByItemId(itemId);
    }

    @PostMapping("/borrow-requests")
    public ResponseEntity<BorrowRequestDTO> createBorrowRequest2(@RequestBody Map<String, String> borrowRequestData) {


        long userId = Integer.parseInt(borrowRequestData.get("userId"));
        long itemId = Integer.parseInt(borrowRequestData.get("itemId"));
        LocalDateTime intendedStartDate = LocalDateTime.parse(borrowRequestData.get("intendedStartDate"), DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        LocalDateTime intendedReturnDate = LocalDateTime.parse(borrowRequestData.get("intendedReturnDate"), DateTimeFormatter.ISO_DATE_TIME).plusHours(3);


        int quantity = Integer.parseInt(borrowRequestData.get("quantity"));
        BorrowRequestDTO borrowRequestDTO = BorrowRequestDTO.builder()
                .userId(userId)
                .itemId(itemId)
                .intendedReturnDate(intendedReturnDate)
                .signatureData(borrowRequestData.get("signatureData"))
                .borrowingReason(borrowRequestData.get("borrowingReason"))
                .intendedStartDate(intendedStartDate)
                .quantity(quantity)
                .build();

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


    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/borrow-requests/schedule/{itemId}")
    public List<ScheduleDTO> getScheduleByItemId(@PathVariable Long itemId) {
        List<ScheduleDTO> x = borrowRequestService.getAllScheduleByItemID(itemId);
        System.out.println(x);
        return x;
    }


    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/borrow-requests/get_every_time_schedule/{quantity}")
    public AvailableTime startTime(@PathVariable int quantity,
                                   @RequestParam String localDateTime,
                                   @RequestParam long itemId) {
        LocalDateTime localDateTimeO = LocalDateTime.parse(localDateTime, DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        return borrowRequestService.getEveryTimeSchedule(itemId, quantity, localDateTimeO);
        //return borrowRequestService.getAvailableSchedules(itemId, quantity, localDateTimeO);
    }


    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/borrow-requests/get_every_time_to-return/{quantity}")
    public AvailableTime getEveryTimeSchedule(
            @PathVariable int quantity,
            @RequestParam String localDateTimeStart,
            @RequestParam String localDateTimeReturn,
            @RequestParam long itemId,
            @RequestBody List<ItemInstance> itemInstances) {

        LocalDateTime localDateTimeStartO = LocalDateTime.parse(localDateTimeStart, DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        LocalDateTime localDateTimeReturnO = LocalDateTime.parse(localDateTimeReturn, DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        //return borrowRequestService.getAvailableReturnTimes(quantity, localDateTimeStartO, localDateTimeReturnO, itemInstances, itemId);
        return borrowRequestService.getEveryTimeToReturnInSchedule(quantity, localDateTimeStartO, localDateTimeReturnO, itemInstances, itemId);

    }


    @GetMapping("/borrow-requests/{requestId}/instances")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemInstanceDTO> getItemInstancesByRequestId(@PathVariable UUID requestId) {
        return borrowRequestService.getItemInstancesByRequestId(requestId);
    }

    @PutMapping("/borrow-requests/{requestId}/cancel")
    @ResponseStatus(HttpStatus.OK)
    public void cancelBorrowRequest(@PathVariable UUID requestId) {
        borrowRequestService.cancelBorrowRequest(requestId);
    }
}