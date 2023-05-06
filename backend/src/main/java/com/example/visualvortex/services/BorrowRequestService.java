package com.example.visualvortex.services;

import com.example.visualvortex.dtos.AvailableTime;
import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.dtos.ScheduleDTO;
import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.entities.Item.ItemState;
import com.example.visualvortex.entities.Item.ItemType;
import com.example.visualvortex.entities.Request.BorrowRequest;
import com.example.visualvortex.entities.Request.RequestStatus;
import com.example.visualvortex.entities.Schedule;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.errors.ResourceNotFoundException;
import com.example.visualvortex.repositories.BorrowRequestRepository;
import com.example.visualvortex.repositories.ScheduleRepository;
import com.example.visualvortex.services.Item.ItemInstanceService;
import com.example.visualvortex.services.Item.ItemService;
import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BorrowRequestService {
    private final BorrowRequestRepository borrowRequestRepository;
    private final NotificationsService notificationsService;
    private final ItemService itemService;
    private final ScheduleRepository scheduleRepository;
    private final ItemInstanceService itemInstanceService;
    private final UserService userService;
    private final FirebaseService firebaseService;

    public List<BorrowRequestDTO> getAllRequests() {
        return borrowRequestRepository.findAll().stream()
                .map(this::convertToBorrowRequestDTO)
                .collect(Collectors.toList());
    }

    public List<BorrowRequestDTO> getPendingRequestsByItemInstance(Long itemInstanceId) {
        return null;
    }

    public BorrowRequestDTO createBorrowRequest2(Map<String, Object> borrowRequestData) {
        Long userId = Long.parseLong(borrowRequestData.get("userId").toString());
        List<Long> itemIds = ((List<?>) borrowRequestData.get("itemIds")).stream()
                .map(id -> Long.parseLong(id.toString()))
                .collect(Collectors.toList());
        LocalDateTime intendedStartDate = LocalDateTime.parse(borrowRequestData.get("intendedStartDate").toString(), DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        LocalDateTime intendedReturnDate = LocalDateTime.parse(borrowRequestData.get("intendedReturnDate").toString(), DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        String borrowingReason = borrowRequestData.get("borrowingReason").toString();
        String signatureData = borrowRequestData.get("signatureData").toString();

        BorrowRequestDTO borrowRequestDTO = BorrowRequestDTO.builder()
                .userId(userId)
                .itemIds(itemIds)
                .intendedReturnDate(intendedReturnDate)
                .signatureData(signatureData)
                .borrowingReason(borrowingReason)
                .intendedStartDate(intendedStartDate)
                .build();

        return createBorrowRequest(borrowRequestDTO);
    }


    public BorrowRequestDTO createBorrowRequest(BorrowRequestDTO dto) {
        UUID requestId = UUID.randomUUID();

        Optional<String> idOptional = firebaseService.save(dto.getSignatureData());
        if (idOptional.isPresent()) {
            String id = idOptional.get();
            dto.setSignatureData(id);
        }

        BorrowRequest borrowRequest = BorrowRequest.builder()
                .requestId(requestId)
                .userId(dto.getUserId())
                .itemIds(dto.getItemIds())
                .intendedStartDate(dto.getIntendedStartDate())
                .intendedReturnDate(dto.getIntendedReturnDate())
                .borrowingReason(dto.getBorrowingReason())
                .signatureData(dto.getSignatureData())
                .requestTime(LocalDateTime.now())
                .status(RequestStatus.PENDING)
                .build();


        BorrowRequest savedBorrowRequest = borrowRequestRepository.save(borrowRequest);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM HH:mm");
        String formattedIntendedStartDate = borrowRequest.getIntendedStartDate().format(formatter);
        String formattedIntendedReturnDate = borrowRequest.getIntendedReturnDate().format(formatter);

        notificationsService.createNotification(dto.getUserId(),
                "Your request to borrow " + "requestedItems.get()" +
                        " for the period : " + formattedIntendedStartDate +
                        " to : " + formattedIntendedReturnDate + " was sent to review.");


        return convertToBorrowRequestDTO(savedBorrowRequest);
    }

    public BorrowRequestDTO updateRequestStatus(UUID requestId, RequestStatus status) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId));

        if (borrowRequest.getStatus() == RequestStatus.AWAITING_PICKUP && status == RequestStatus.AWAITING_RETURN) {
            List<ItemInstance> associatedInstances = itemInstanceService.getInstancesByIds(borrowRequest.getItemInstanceIds());

            User user = userService.getUserById(borrowRequest.getUserId());

            for (ItemInstance instance : associatedInstances) {
                ItemType itemType = instance.getItem().getItemType();
                Schedule schedule = Schedule.builder()
                        .itemInstance(instance)
                        .intendedStartDate(borrowRequest.getIntendedStartDate())
                        .intendedReturnDate(borrowRequest.getIntendedReturnDate())
                        .user(user)
                        .itemType(itemType)
                        .isActive(true)
                        .build();
                instance.setState(ItemState.TAKEN);
                scheduleRepository.save(schedule);
            }
        }

        if (status == RequestStatus.CANCELLED || status == RequestStatus.RETURNED) {
            List<ItemInstance> associatedInstances = itemInstanceService.getInstancesByIds(borrowRequest.getItemInstanceIds());
            for (ItemInstance instance : associatedInstances) {
                instance.setState(ItemState.AVAILABLE);
                List<Schedule> scheduleList = scheduleRepository.findByItemInstance(instance);
                if (scheduleList != null && scheduleList.size() != 0) {
                    scheduleList.forEach(schedule -> schedule.setActive(false));
                }
            }
        }

        borrowRequest.setStatus(status);
        BorrowRequest updatedBorrowRequest = borrowRequestRepository.save(borrowRequest);

        // Send notification to the user after updating the request status
        String notificationMessage;
        if (status == RequestStatus.AWAITING_PICKUP) {
            notificationMessage = "Your borrow request has been approved. Please pick up your item(s).";
        } else if (status == RequestStatus.REJECTED) {
            notificationMessage = "Your borrow request has been rejected. Please contact the admin for more information.";
        } else if (status == RequestStatus.CANCELLED) {
            notificationMessage = "Your borrow request has been cancelled.";
        } else if (status == RequestStatus.RETURNED) {
            notificationMessage = "Your item(s) have been successfully returned. Thank you!";
        } else {
            return convertToBorrowRequestDTO(updatedBorrowRequest);
        }
        notificationsService.createNotification(borrowRequest.getUserId(), notificationMessage);

        return convertToBorrowRequestDTO(updatedBorrowRequest);

    }

    private BorrowRequestDTO convertToBorrowRequestDTO(BorrowRequest borrowRequest) {
        return BorrowRequestDTO.builder()
                .userId(borrowRequest.getUserId())
                .itemIds(borrowRequest.getItemIds())
                .intendedStartDate(borrowRequest.getIntendedStartDate())
                .intendedReturnDate(borrowRequest.getIntendedReturnDate())
                .borrowingReason(borrowRequest.getBorrowingReason())
                .status(borrowRequest.getStatus())
                .requestTime(borrowRequest.getRequestTime())
                .requestId(borrowRequest.getRequestId())
                .build();
    }

    public List<ScheduleDTO> getAllOccupiedDatesByItemInstances(List<Long> itemInstanceIds) {
        return scheduleRepository.findByItemInstanceIdIn(itemInstanceIds).stream()
                .filter(Schedule::isActive)
                .map(this::convertToScheduleDTO)
                .collect(Collectors.toList());
    }


    public List<ItemInstanceDTO> getItemInstancesByRequestId(UUID requestId) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId));
        List<Long> itemInstanceIds = borrowRequest.getItemInstanceIds();
        List<ItemInstance> itemInstances = itemInstanceService.getInstancesByIds(itemInstanceIds);
        return itemInstances.stream()
                .map(this::convertToItemInstanceDTO)
                .collect(Collectors.toList());
    }

    private ItemInstanceDTO convertToItemInstanceDTO(ItemInstance itemInstance) {
        return ItemInstanceDTO.builder()
                .id(itemInstance.getId())
                .state(itemInstance.getState())
                .itemId(itemInstance.getItem().getId())
                .build();
    }

    private ScheduleDTO convertToScheduleDTO(Schedule schedule) {
        return ScheduleDTO.builder()
                .id(schedule.getId())
                .itemInstanceId(schedule.getItemInstance().getId())
                .intendedStartDate(schedule.getIntendedStartDate())
                .intendedReturnDate(schedule.getIntendedReturnDate())
                .userId(schedule.getUser().getId())
                .itemTypeId(schedule.getItemType().getId())
                .build();
    }

    private boolean isBorrowRequestValid(BorrowRequest request, LocalDateTime currentDateTime, LocalDateTime startDateTime) {
        LocalDateTime requestStart = request.getIntendedStartDate();
        LocalDateTime requestEnd = request.getIntendedReturnDate();
        boolean isStartValid = (requestStart.isAfter(startDateTime) || requestStart.isEqual(startDateTime));
        boolean isWithinCurrentTime = (requestStart.isBefore(currentDateTime) || requestStart.isEqual(currentDateTime));
        boolean isEndValid = (requestEnd.isBefore(currentDateTime) && (requestEnd.isAfter(startDateTime) || requestEnd.isEqual(startDateTime)));

        return (isStartValid && isWithinCurrentTime) || isEndValid;
    }

    public List<BorrowRequestDTO> getRequestsByUserId(Long userId) {
        return borrowRequestRepository.findByUserId(userId).stream()
                .map(this::convertToBorrowRequestDTO)
                .collect(Collectors.toList());
    }

    public void cancelBorrowRequest(UUID requestId) {
        BorrowRequest borrowRequest = borrowRequestRepository.findByRequestId(requestId);
        if (borrowRequest != null && (borrowRequest.getStatus() == RequestStatus.PENDING || borrowRequest.getStatus() == RequestStatus.AWAITING_PICKUP)) {
            borrowRequest.setStatus(RequestStatus.CANCELLED);
            borrowRequestRepository.save(borrowRequest);

            List<Item> item = itemService.getItemsByIds(borrowRequest.getItemIds());

            notificationsService.createNotification(borrowRequest.getUserId(),
                    "Your request to borrow " + "item.getName()" +
                            " with ID " + requestId.toString() +
                            " has been cancelled.");
        } else {
            throw new NotFoundException("Borrow request not found or not in a cancellable state.");
        }
    }

    public List<Long> getItemsIdsByRequestId(UUID requestId) {
        return borrowRequestRepository.findById(requestId)
                .map(BorrowRequest::getItemIds)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow request not found with id: " + requestId));
    }

    public void borrowAddItemInstances(UUID requestId, List<Long> itemInstances) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId));
        borrowRequest.setItemInstanceIds(itemInstances);
        borrowRequestRepository.save(borrowRequest);
    }
}