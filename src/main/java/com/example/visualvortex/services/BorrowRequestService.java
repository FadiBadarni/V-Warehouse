package com.example.visualvortex.services;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.BorrowRequest;
import com.example.visualvortex.entities.InventoryItem;
import com.example.visualvortex.entities.RequestStatus;
import com.example.visualvortex.errors.ResourceNotFoundException;
import com.example.visualvortex.repositories.BorrowRequestRepository;
import com.example.visualvortex.repositories.NotificationsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class BorrowRequestService {
    private final BorrowRequestRepository borrowRequestRepository;
    private final NotificationsService notificationsService;
    private final NotificationsRepository notificationsRepository;


    public List<BorrowRequest> getAllRequests() {
        return borrowRequestRepository.findAll();
    }


    public BorrowRequestDTO createBorrowRequest(BorrowRequestDTO dto) {
        UUID requestId = UUID.randomUUID();
        BorrowRequest borrowRequest = BorrowRequest.builder()
                .requestId(requestId)
                .userId(dto.getUserId())
                .itemId(dto.getItemId())
                .intendedStartDate(dto.getIntendedStartDate())
                .intendedReturnDate(dto.getIntendedReturnDate())
                .borrowingReason(dto.getBorrowingReason())
                .quantity(dto.getQuantity())
                .sentRequestTime(LocalDateTime.now())
                .status(RequestStatus.PENDING)
                .build();

        BorrowRequest savedBorrowRequest = borrowRequestRepository.save(borrowRequest);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setDate(LocalDateTime.now());
        notificationDTO.setUserId(dto.getUserId());
        notificationDTO.setMessage("Your Request Was Sent.");
        notificationsService.createNotification(notificationDTO);

        return convertToBorrowRequestDTO(savedBorrowRequest);
    }

    public BorrowRequestDTO updateRequestStatus(UUID requestId, RequestStatus status) {
        Optional<BorrowRequest> borrowRequestOpt = borrowRequestRepository.findById(requestId);
        if (borrowRequestOpt.isPresent()) {
            BorrowRequest borrowRequest = borrowRequestOpt.get();
            borrowRequest.setStatus(status);
            BorrowRequest updatedBorrowRequest = borrowRequestRepository.save(borrowRequest);
            return convertToBorrowRequestDTO(updatedBorrowRequest);
        } else {
            throw new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId);
        }
    }

    private BorrowRequestDTO convertToBorrowRequestDTO(BorrowRequest borrowRequest) {
        return BorrowRequestDTO.builder()
                .userId(borrowRequest.getUserId())
                .itemId(borrowRequest.getItemId())
                .intendedStartDate(borrowRequest.getIntendedStartDate())
                .intendedReturnDate(borrowRequest.getIntendedReturnDate())
                .borrowingReason(borrowRequest.getBorrowingReason())
                .quantity(borrowRequest.getQuantity())
                .status(borrowRequest.getStatus())
                .sentRequestTime(borrowRequest.getSentRequestTime())
                .requestId(borrowRequest.getRequestId())
                .build();
    }
}
