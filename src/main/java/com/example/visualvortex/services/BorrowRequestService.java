package com.example.visualvortex.services;

import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.NotificationDTO;
import com.example.visualvortex.entities.Request.BorrowRequest;
import com.example.visualvortex.entities.Request.RequestStatus;
import com.example.visualvortex.errors.ResourceNotFoundException;
import com.example.visualvortex.repositories.BorrowRequestRepository;
import com.example.visualvortex.repositories.NotificationsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BorrowRequestService {
    private final BorrowRequestRepository borrowRequestRepository;
    private final NotificationsService notificationsService;


    public List<BorrowRequestDTO> getAllRequests() {
        return borrowRequestRepository.findAll().stream()
                .map(this::convertToBorrowRequestDTO)
                .collect(Collectors.toList());
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
                .requestTime(LocalDateTime.now())
                .status(RequestStatus.PENDING)
                .build();

        BorrowRequest savedBorrowRequest = borrowRequestRepository.save(borrowRequest);

        notificationsService.createNotification(dto.getUserId(), "Your Request Was Sent.");


        return convertToBorrowRequestDTO(savedBorrowRequest);
    }

    public BorrowRequestDTO updateRequestStatus(UUID requestId, RequestStatus status) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId));

        borrowRequest.setStatus(status);
        BorrowRequest updatedBorrowRequest = borrowRequestRepository.save(borrowRequest);

        return convertToBorrowRequestDTO(updatedBorrowRequest);
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
                .requestTime(borrowRequest.getRequestTime())
                .requestId(borrowRequest.getRequestId())
                .build();
    }
}
