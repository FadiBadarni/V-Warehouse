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
import java.util.stream.Collectors;

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
      return  borrowRequestService.getPendingRequestsByItemInstance(itemInstanceId);

    }
    @GetMapping("/borrow-requests/pendingByItemId/{itemId}")
    @ResponseStatus(HttpStatus.OK)
    public List<BorrowRequest> getPendingRequestsByItemId(@PathVariable Long itemId) {
        return borrowRequestService.getPendingRequestsByItemId(itemId);
    }




//    @PostMapping("/borrow-requests")
//    public ResponseEntity<BorrowRequestDTO> createBorrowRequest(@RequestBody BorrowRequestDTO borrowRequestDTO) {
//
//        System.out.println("START");
//        Optional<String> idOptional = firebaseService.save(borrowRequestDTO.getSignatureData());
//
//        if (idOptional.isPresent()) {
//            String id = idOptional.get();
//            borrowRequestDTO.setSignatureData(id);
//            BorrowRequestDTO newBorrowRequestDTO = borrowRequestService.createBorrowRequest(borrowRequestDTO);
//            return new ResponseEntity<>(newBorrowRequestDTO, HttpStatus.CREATED);
//        } else {
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @PostMapping("/borrow-requests2")
    public ResponseEntity<BorrowRequestDTO> createBorrowRequest2(@RequestBody Map<String,String>   borrowRequestData) {

        System.out.println("START");

        long userId = Integer.parseInt(borrowRequestData.get("userId"));
        long itemId=Integer.parseInt(borrowRequestData.get("itemId"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        System.out.println(borrowRequestData.get("intendedStartDate"));
        LocalDateTime intendedStartDate = LocalDateTime.parse(borrowRequestData.get("intendedStartDate"), formatter).plusDays(1);
        LocalDateTime intendedReturnDate = LocalDateTime.parse(borrowRequestData.get("intendedReturnDate"), formatter).plusDays(1);
        System.out.println("START2");

        int quantity = Integer.parseInt(borrowRequestData.get("quantity"));
        System.out.println("START3");
        BorrowRequestDTO    borrowRequestDTO=   BorrowRequestDTO.builder()
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
        List<ScheduleDTO> x=  borrowRequestService.getAllScheduleByItemID(itemId);
        System.out.println(x);
        return x;
    }



    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/borrow-requests/get_every_time_schedule/{quantity}")
    public AvailableTime startTime(@PathVariable int quantity,
                                   @RequestParam String localDateTime,
                                   @RequestParam long itemId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.ENGLISH);
        LocalDateTime localDateTimeO = LocalDateTime.parse(localDateTime, formatter).plusDays(1);
        return borrowRequestService.getEveryTimeSchedule(itemId,quantity,localDateTimeO);
    }



    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/borrow-requests/get_every_time_to-return/{quantity}")
    public  AvailableTime getEveryTimeSchedule(
            @PathVariable int quantity,
            @RequestParam String localDateTimeStart,
            @RequestParam String localDateTimeReturn,
            @RequestParam long itemId,
            @RequestBody List<ItemInstance> itemInstances) {


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.ENGLISH);
        LocalDateTime localDateTimeStartO = LocalDateTime.parse(localDateTimeStart, formatter).plusDays(1);
        LocalDateTime localDateTimeReturnO = LocalDateTime.parse(localDateTimeReturn, formatter).plusDays(1);
       return  borrowRequestService.getEveryTimeToReturnInSchedule(quantity,localDateTimeStartO, localDateTimeReturnO,itemInstances,itemId);
    }





    @GetMapping("/borrow-requests/{requestId}/instances")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemInstanceDTO> getItemInstancesByRequestId(@PathVariable UUID requestId) {
        return borrowRequestService.getItemInstancesByRequestId(requestId);
    }





}
