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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
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

    public List<BorrowRequestDTO> getAllRequests() {
        return borrowRequestRepository.findAll().stream()
                .map(this::convertToBorrowRequestDTO)
                .collect(Collectors.toList());
    }

    public List<BorrowRequestDTO> getPendingRequestsByItemInstance(Long itemInstanceId) {
        return null;
    }

    public List<BorrowRequest> getPendingRequestsByItemId(Long itemInstanceId) {
        return borrowRequestRepository.findPendingRequestsByItemId(itemInstanceId, RequestStatus.PENDING);
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
                .signatureData(dto.getSignatureData())
                .requestTime(LocalDateTime.now())
                .status(RequestStatus.PENDING)
                .build();

        BorrowRequest savedBorrowRequest = borrowRequestRepository.save(borrowRequest);
        Item requestedItem = itemService.getItemById(dto.getItemId());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM HH:mm");
        String formattedIntendedStartDate = borrowRequest.getIntendedStartDate().format(formatter);
        String formattedIntendedReturnDate = borrowRequest.getIntendedReturnDate().format(formatter);

        notificationsService.createNotification(dto.getUserId(),
                "Your request to borrow " + requestedItem.getName() +
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

    public List<ScheduleDTO> getAllScheduleByItemID(Long itemId) {
        return scheduleRepository.findByItemTypeId(itemId).stream()
                .filter(Schedule::isActive)
                .map(this::convertToScheduleDTO)
                .collect(Collectors.toList());
    }


    public AvailableTime calculateAvailableTimes(List<Schedule> schedules,
                                                 LocalDateTime localDateTime,
                                                 int requiredQuantity,
                                                 List<ItemInstance> itemInstances,
                                                 List<BorrowRequest> awaitingBorrowRequests,
                                                 List<BorrowRequest> pendingBorrowRequests) {
        LocalDateTime startDate = localDateTime.toLocalDate().atStartOfDay();
        LocalDateTime endDate = localDateTime.toLocalDate().atTime(23, 59);
        HashMap<LocalDateTime, List<ItemInstance>> availableInstancesByTime = new HashMap<>();
        List<LocalDateTime> pendingStartDates = new ArrayList<>();
        LocalDateTime currentDateTime = startDate;

        while (currentDateTime.isBefore(endDate)) {
            List<ItemInstance> availableInstances = new ArrayList<>(itemInstances);
            for (Schedule schedule : schedules) {
                LocalDateTime orderStart = schedule.getIntendedStartDate();
                LocalDateTime orderEnd = schedule.getIntendedReturnDate();

                if (!(currentDateTime.isBefore(orderEnd) && (currentDateTime.isAfter(orderStart)) || currentDateTime.isEqual(orderStart))) {
                    availableInstances.removeIf(instance -> instance.getId() == schedule.getItemInstance().getId());
                }
            }

            int awaitingQuantity = countQuantityInTimeRange(awaitingBorrowRequests, currentDateTime);

            if (availableInstances.size() >= requiredQuantity + awaitingQuantity) {
                availableInstancesByTime.put(currentDateTime, availableInstances);
                int pendingQuantity = countQuantityInTimeRange(pendingBorrowRequests, currentDateTime);

                if (availableInstances.size() < pendingQuantity + requiredQuantity) {
                    pendingStartDates.add(currentDateTime);
                }
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return AvailableTime.builder().bendingStartDates(pendingStartDates).startDates(availableInstancesByTime).build();
    }

    private int countQuantityInTimeRange(List<BorrowRequest> borrowRequests, LocalDateTime currentDateTime) {
        int count = 0;
        for (BorrowRequest borrowRequest : borrowRequests) {
            LocalDateTime requestStart = borrowRequest.getIntendedStartDate();
            LocalDateTime requestEnd = borrowRequest.getIntendedReturnDate();

            if ((currentDateTime.isBefore(requestEnd) && (currentDateTime.isAfter(requestStart)) || currentDateTime.isEqual(requestStart))) {
                count += borrowRequest.getQuantity();
            }
        }
        return count;
    }

    public AvailableTime getAvailableSchedules(long itemId, int quantity, LocalDateTime localDateTime) {
        List<Schedule> schedules = scheduleRepository.findByItemTypeId(itemId);
        List<Schedule> inactiveSchedules = schedules.stream().filter(schedule -> !schedule.isActive()).toList();
        List<ItemInstance> itemInstances = itemInstanceService.findByItemTypeId(itemId);

        List<BorrowRequest> borrowRequests = borrowRequestRepository.findAll();
        List<BorrowRequest> awaitingBorrowRequests = filterBorrowRequestsByStatusAndItemId(borrowRequests, RequestStatus.AWAITING_PICKUP, itemId);
        List<BorrowRequest> pendingBorrowRequests = filterBorrowRequestsByStatusAndItemId(borrowRequests, RequestStatus.PENDING, itemId);

        return calculateAvailableTimes(inactiveSchedules, localDateTime, quantity, itemInstances, awaitingBorrowRequests, pendingBorrowRequests);
    }

    public AvailableTime getAvailableReturnTimes(int quantity, LocalDateTime startDateTime, LocalDateTime endDateTime, List<ItemInstance> itemInstances, long itemId) {
        List<BorrowRequest> borrowRequests = borrowRequestRepository.findAll();
        List<BorrowRequest> awaitingBorrowRequests = filterBorrowRequestsByStatusAndItemId(borrowRequests, RequestStatus.AWAITING_PICKUP, itemId);
        List<BorrowRequest> pendingBorrowRequests = filterBorrowRequestsByStatusAndItemId(borrowRequests, RequestStatus.PENDING, itemId);

        return calculateAvailableReturnTimes(quantity, startDateTime, endDateTime, itemInstances, awaitingBorrowRequests, pendingBorrowRequests);
    }

    private List<BorrowRequest> filterBorrowRequestsByStatusAndItemId(List<BorrowRequest> borrowRequests, RequestStatus status, long itemId) {
        return borrowRequests.stream()
                .filter(request -> request.getStatus() == status && request.getItemId() == itemId)
                .collect(Collectors.toList());
    }


    public AvailableTime calculateAvailableReturnTimes(int requiredQuantity, LocalDateTime startDateTime, LocalDateTime endDateTime,
                                                       List<ItemInstance> itemInstances, List<BorrowRequest> awaitingBorrowRequests,
                                                       List<BorrowRequest> pendingBorrowRequests) {

        LocalDateTime currentDateTime = getStartDate(startDateTime, endDateTime);
        LocalDateTime finalDateTime = endDateTime.withHour(23).withMinute(59);

        List<LocalDateTime> availableReturnTimes = new ArrayList<>();
        List<LocalDateTime> bendingReturnTimes = new ArrayList<>();

        while (currentDateTime.isBefore(finalDateTime)) {
            List<ItemInstance> availableInstances = getAvailableInstances(currentDateTime, startDateTime, itemInstances);

            int awaitingCount = calculateBorrowRequestCount(currentDateTime, startDateTime, awaitingBorrowRequests);
            int pendingCount = calculateBorrowRequestCount(currentDateTime, startDateTime, pendingBorrowRequests);

            if (availableInstances.size() >= requiredQuantity + awaitingCount) {
                availableReturnTimes.add(currentDateTime);

                if (availableInstances.size() < pendingCount + requiredQuantity) {
                    bendingReturnTimes.add(currentDateTime);
                }
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return AvailableTime.builder().returnDates(availableReturnTimes).bendingReturnDates(bendingReturnTimes).build();
    }

    private LocalDateTime getStartDate(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime.toLocalDate().isEqual(endDateTime.toLocalDate())) {
            return startDateTime;
        } else {
            return endDateTime.toLocalDate().atStartOfDay();
        }
    }

    private List<ItemInstance> getAvailableInstances(LocalDateTime currentDateTime, LocalDateTime startDateTime, List<ItemInstance> itemInstances) {
        List<ItemInstance> availableInstances = new ArrayList<>(itemInstances);

        for (ItemInstance itemInstance : itemInstances) {
            List<Schedule> schedules = scheduleRepository.findByItemInstance(itemInstance);

            if (schedules != null) {
                schedules.stream()
                        .filter(schedule -> isItemInstanceUnavailable(schedule, currentDateTime, startDateTime))
                        .forEach(schedule -> availableInstances.removeIf(instance -> instance.getId() == schedule.getItemInstance().getId()));
            }
        }
        return availableInstances;
    }

    private boolean isItemInstanceUnavailable(Schedule schedule, LocalDateTime currentDateTime, LocalDateTime startDateTime) {
        LocalDateTime orderStart = schedule.getIntendedStartDate();
        LocalDateTime orderEnd = schedule.getIntendedReturnDate();
        return !(currentDateTime.isAfter(orderEnd) && (startDateTime.isBefore(orderStart) || startDateTime.isEqual(orderStart)));
    }

    private int calculateBorrowRequestCount(LocalDateTime currentDateTime, LocalDateTime startDateTime, List<BorrowRequest> borrowRequests) {
        return borrowRequests.stream()
                .filter(request -> isBorrowRequestValid(request, currentDateTime, startDateTime))
                .mapToInt(BorrowRequest::getQuantity)
                .sum();
    }

    private boolean isBorrowRequestValid(BorrowRequest request, LocalDateTime currentDateTime, LocalDateTime startDateTime) {
        LocalDateTime requestStart = request.getIntendedStartDate();
        LocalDateTime requestEnd = request.getIntendedReturnDate();
        boolean isStartValid = (requestStart.isAfter(startDateTime) || requestStart.isEqual(startDateTime));
        boolean isWithinCurrentTime = (requestStart.isBefore(currentDateTime) || requestStart.isEqual(currentDateTime));
        boolean isEndValid = (requestEnd.isBefore(currentDateTime) && (requestEnd.isAfter(startDateTime) || requestEnd.isEqual(startDateTime)));

        return (isStartValid && isWithinCurrentTime) || isEndValid;
    }

    public void borrowAddItemInstances(UUID requestId, List<Long> itemInstances) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId));
        borrowRequest.setItemInstanceIds(itemInstances);
        borrowRequestRepository.save(borrowRequest);
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

            Item item = itemService.getItemById(borrowRequest.getItemId());

            notificationsService.createNotification(borrowRequest.getUserId(),
                    "Your request to borrow " + item.getName() +
                            " with ID " + requestId.toString() +
                            " has been cancelled.");
        } else {
            throw new NotFoundException("Borrow request not found or not in a cancellable state.");
        }
    }

}