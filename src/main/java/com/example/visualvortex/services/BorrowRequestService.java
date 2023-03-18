package com.example.visualvortex.services;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.BorrowRequest;
import com.example.visualvortex.repositories.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.Base64;
import java.util.Optional;

@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private NotificationsService notificationsService;

    public BorrowRequestDTO createBorrowRequest(BorrowRequestDTO borrowRequestDTO) {
        BorrowRequest borrowRequest = new BorrowRequest();
        borrowRequest.setUserId(borrowRequestDTO.getUserId());
        borrowRequest.setItemId(borrowRequestDTO.getItemId());
        borrowRequest.setIntendedStartDate(borrowRequestDTO.getIntendedStartDate());
        borrowRequest.setIntendedReturnDate(borrowRequestDTO.getIntendedReturnDate());
        borrowRequest.setBorrowingReason(borrowRequestDTO.getBorrowingReason());
        borrowRequest.setQuantity(borrowRequestDTO.getQuantity());

//        System.out.println("signatureData before decoding: " + borrowRequestDTO.getSignatureData());
//        try {
//            byte[] signatureBytes = Base64.getMimeDecoder().decode(borrowRequestDTO.getSignatureData());
//            borrowRequest.setSignatureData(signatureBytes);
//        } catch (IllegalArgumentException e) {
//            e.printStackTrace();
//        }

        BorrowRequest savedBorrowRequest = borrowRequestRepository.save(borrowRequest);

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
