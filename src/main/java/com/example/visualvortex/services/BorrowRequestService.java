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
//        return borrowRequestRepository.findAllByStatusAndItemInstanceIdsContains(RequestStatus.PENDING, itemInstanceId).stream()
//                .map(this::convertToBorrowRequestDTO)
//                .collect(Collectors.toList());
        return null;
    }
    public List<BorrowRequest> getPendingRequestsByItemId(Long itemInstanceId) {
        return borrowRequestRepository.findPendingRequestsByItemId(itemInstanceId,RequestStatus.PENDING);
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

        if (borrowRequest.getStatus() == RequestStatus.PENDING && status == RequestStatus.AWAITING_PICKUP) {}
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
                if (scheduleList != null && scheduleList.size()!=0) {
                    scheduleList.stream().forEach(schedule -> schedule.setActive(false));
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
        return  scheduleRepository.findByItemTypeId(itemId).stream()
                .filter(Schedule::isActive)
                .map(this::convertToScheduleDTO)
                .collect(Collectors.toList());
    }


    public AvailableTime getEveryTimeSchedule(long itemId ,int quantity, LocalDateTime localDateTime) {


        List<Schedule> scheduleTable=scheduleRepository.findByItemTypeId(itemId);
        List<Schedule> filteredScheduleTable= scheduleTable.stream().filter(schedule -> !schedule.isActive()).toList();

        List<ItemInstance> itemInstanceTable=itemInstanceService.findByItemTypeId(itemId);

        List<BorrowRequest> borrowRequestsTable=borrowRequestRepository.findAll();
        List<BorrowRequest> awaitingBorrowRequestsTable = borrowRequestsTable.stream()
                .filter(request -> request.getStatus() == RequestStatus.AWAITING_PICKUP && request.getItemId() == itemId)
                .collect(Collectors.toList());

        List<BorrowRequest> bendingBorrowRequestsTable = borrowRequestsTable.stream()
                .filter(request -> request.getStatus() == RequestStatus.PENDING && request.getItemId() == itemId)
                .collect(Collectors.toList());
        return startData(filteredScheduleTable,localDateTime,quantity,itemInstanceTable,awaitingBorrowRequestsTable,bendingBorrowRequestsTable);

    }


    public AvailableTime startData(List<Schedule> orderList, LocalDateTime localDateTime, int x, List<ItemInstance> itemInstanceList, List<BorrowRequest> awaitingBorrowRequestsTable, List<BorrowRequest>  bendingBorrowRequestsTable)
    {
        LocalDateTime startDate = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        HashMap< LocalDateTime, List<ItemInstance>> data=new HashMap<>();
        List< LocalDateTime>bendinglist =new ArrayList<>();
        LocalDateTime currentDateTime = startDate;
        while (currentDateTime.isBefore(endDateTime)) {

            List<ItemInstance> availableIds = new ArrayList<>(itemInstanceList);
            for (Schedule schedule : orderList) {
                LocalDateTime orderStart =  schedule.getIntendedStartDate();
                LocalDateTime orderEnd =  schedule.getIntendedReturnDate();

                if (!(currentDateTime.isBefore(orderEnd) && currentDateTime.isAfter(orderStart)))
                    availableIds.removeAll(itemInstanceService.getInstancesById(schedule.getItemInstance().getId()));

            }
            int count=0;
            for(BorrowRequest borrowRequest:awaitingBorrowRequestsTable)
                if((currentDateTime.isBefore( borrowRequest.getIntendedReturnDate())&& currentDateTime.isAfter(borrowRequest.getIntendedStartDate())))
                   count+=borrowRequest.getQuantity();

            if( availableIds.size()>=x+count ){
                data.put(currentDateTime,availableIds);
                count=0;
                for(BorrowRequest borrowRequest:bendingBorrowRequestsTable)
                    if((currentDateTime.isBefore( borrowRequest.getIntendedReturnDate())&& currentDateTime.isAfter(borrowRequest.getIntendedStartDate())))
                        count+=borrowRequest.getQuantity();
                if(availableIds.size()<count+x) {
                    bendinglist.add(currentDateTime);
                    System.out.println(currentDateTime);
                }

            }

            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return AvailableTime.builder().bendingStartDates(bendinglist).startDates(data).build();
    }




    public AvailableTime getEveryTimeToReturnInSchedule(int quantity,LocalDateTime localDateTimeStart,LocalDateTime localDateTimeReturn, List<ItemInstance> data,long itemId) {


        List<BorrowRequest> borrowRequests=borrowRequestRepository.findAll();
        List<BorrowRequest> filteredList = borrowRequests.stream()
                .filter(request -> request.getStatus() == RequestStatus.AWAITING_PICKUP && request.getItemId() == itemId)
                .collect(Collectors.toList());
        List<BorrowRequest> bendingBorrowRequestsTable =borrowRequests.stream()
                .filter(request -> request.getStatus() == RequestStatus.PENDING && request.getItemId() == itemId)
                .collect(Collectors.toList());
         return returnData(quantity,localDateTimeStart,localDateTimeReturn,data,filteredList,bendingBorrowRequestsTable);
    }

    public  AvailableTime returnData(int i, LocalDateTime localDateTimeStart, LocalDateTime localDateTimeEnd, List<ItemInstance> data, List<BorrowRequest> awaitingBorrowRequestsTable,List<BorrowRequest> bendingBorrowRequestsTable) {

        LocalDateTime startDate = LocalDateTime.of(localDateTimeEnd.getYear(), localDateTimeEnd.getMonth(), localDateTimeEnd.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTimeEnd.getYear(), localDateTimeEnd.getMonth(), localDateTimeEnd.getDayOfMonth(), 23, 59);
        LocalDateTime currentDateTime = startDate;
        List<LocalDateTime> localDateTimeList=new ArrayList<>();

        List< LocalDateTime>bendinglist =new ArrayList<>();

        while (currentDateTime.isBefore(endDateTime)) {
            List<ItemInstance> copydata=new ArrayList<>(data);
            for( ItemInstance itemInstance:data)
            {
                List<Schedule> scheduleList=scheduleRepository.findByItemInstance(itemInstance);
                if(scheduleList!= null)
                {
                    for(Schedule schedule:scheduleList) {
                        LocalDateTime orderStart =schedule.getIntendedStartDate();
                        LocalDateTime orderEnd = schedule.getIntendedReturnDate();

                        if (!(currentDateTime.isAfter(orderEnd) && localDateTimeStart.isBefore(orderStart))) {
                            List<ItemInstance> help=new ArrayList<>();
                            for(ItemInstance instanceData:copydata)
                                if(instanceData.getId()!=schedule.getItemInstance().getId())
                                 help.add(instanceData);
                            copydata=new ArrayList<>(help);
                        }
                    }
                }
            }
            int count=0;
            for(BorrowRequest borrowRequestItem:awaitingBorrowRequestsTable)
                if (currentDateTime.isAfter(borrowRequestItem.getIntendedReturnDate()))
                        if( localDateTimeStart.isBefore(borrowRequestItem.getIntendedStartDate()))
                      count+=borrowRequestItem.getQuantity();

            if (copydata.size() >= i+count){
                localDateTimeList.add(currentDateTime);

                count=0;
                for(BorrowRequest borrowRequest:bendingBorrowRequestsTable)
                    if((currentDateTime.isBefore( borrowRequest.getIntendedReturnDate())&& currentDateTime.isAfter(borrowRequest.getIntendedStartDate())))
                        count+=borrowRequest.getQuantity();

                if(copydata.size()<count+i) {
                    bendinglist.add(currentDateTime);
                    System.out.println(currentDateTime);
                }
            }

            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return  AvailableTime.builder().returnDates(localDateTimeList).bendingReturnDates(bendinglist).build();
    }

    public void borrowAddItemInstances(UUID requestId, List<Long> itemInstances) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowRequest not found with ID: " + requestId));
        borrowRequest.setItemInstanceIds(itemInstances);
        borrowRequestRepository.save(borrowRequest);
    }
}
