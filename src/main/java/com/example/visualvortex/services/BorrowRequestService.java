package com.example.visualvortex.services;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.BorrowRequest;
import com.example.visualvortex.entities.InventoryItem;
import com.example.visualvortex.repositories.BorrowRequestRepository;
import com.example.visualvortex.repositories.NotificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private NotificationsService notificationsService;

    @Autowired
    private NotificationsRepository notificationsRepository;


    public List<BorrowRequest> getAllRequests() {
        return borrowRequestRepository.findAll();
    }


    public BorrowRequestDTO createBorrowRequest(BorrowRequestDTO borrowRequestDTO) {
        BorrowRequest borrowRequest = BorrowRequest.builder()
                .userId(borrowRequestDTO.getUserId())
                .itemId(borrowRequestDTO.getItemId())
                .intendedStartDate(borrowRequestDTO.getIntendedStartDate())
                .intendedReturnDate(borrowRequestDTO.getIntendedReturnDate())
                .borrowingReason(borrowRequestDTO.getBorrowingReason())
                .quantity(borrowRequestDTO.getQuantity())
                .sentRequestTime(LocalDateTime.now())
                .build();

//        System.out.println("signatureData before decoding: " + borrowRequestDTO.getSignatureData());
//        try {
//            byte[] signatureBytes = Base64.getMimeDecoder().decode(borrowRequestDTO.getSignatureData());
//            borrowRequest.setSignatureData(signatureBytes);
//        } catch (IllegalArgumentException e) {
//            e.printStackTrace();
//        }

        BorrowRequest savedBorrowRequest = borrowRequestRepository.save(borrowRequest);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setDate(LocalDateTime.now());
        notificationDTO.setUserId(borrowRequestDTO.getUserId());
        notificationDTO.setMessage("Your Request Was Sent.");
        notificationsService.createNotification(notificationDTO);





        BorrowRequestDTO resultDTO = new BorrowRequestDTO();
        resultDTO.setUserId(savedBorrowRequest.getUserId());
        resultDTO.setItemId(savedBorrowRequest.getItemId());
        resultDTO.setIntendedStartDate(savedBorrowRequest.getIntendedStartDate());
        resultDTO.setIntendedReturnDate(savedBorrowRequest.getIntendedReturnDate());
        resultDTO.setBorrowingReason(savedBorrowRequest.getBorrowingReason());
        resultDTO.setQuantity(savedBorrowRequest.getQuantity());
//        resultDTO.setSignatureData(Base64.getEncoder().encodeToString(savedBorrowRequest.getSignatureData()));

        return resultDTO;
    }

//    public void updateBorrowRequest(Long requestId, String status) {
//        Optional<BorrowRequest> borrowRequestOpt = borrowRequestRepository.findById(requestId);
//        if (borrowRequestOpt.isPresent()) {
//            BorrowRequest borrowRequest = borrowRequestOpt.get();
//
//            borrowRequestRepository.save(borrowRequest);
//
//            // Create a notification for the user
//            NotificationDTO notificationDTO = new NotificationDTO();
//            notificationDTO.setId(borrowRequest.getId());
//            notificationDTO.setMessage(borrowRequest.getBorrowingReason());
//            notificationDTO.setDate(borrowRequest.getIntendedStartDate());
//            notificationDTO.setUserId(borrowRequest.getUserId());
//            notificationsService.createNotification(notificationDTO);
//        }
//    }
}
