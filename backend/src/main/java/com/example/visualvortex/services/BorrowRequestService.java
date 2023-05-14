package com.example.visualvortex.services;

import com.example.visualvortex.dtos.AvailableCounts;
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
import com.fasterxml.jackson.annotation.JsonFormat;
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
        return  borrowRequestRepository.findAll().stream()
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
        LocalDateTime intendedStartDate = LocalDateTime.parse(borrowRequestData.get("intendedStartDate").toString(), DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime intendedReturnDate = LocalDateTime.parse(borrowRequestData.get("intendedReturnDate").toString(), DateTimeFormatter.ISO_DATE_TIME);
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

        if (borrowRequest.getStatus() == RequestStatus.AWAITING_PICKUP) {
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
                .signatureData(borrowRequest.getSignatureData())
                .itemInstanceIds(borrowRequest.getItemInstanceIds())
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



    public AvailableCounts getAvailableCountInTime(UUID uuid) {

        BorrowRequest borrowRequest = borrowRequestRepository.findByRequestId(uuid);
        LocalDateTime start=borrowRequest.getIntendedStartDate();
        LocalDateTime end=borrowRequest.getIntendedReturnDate();
        List<BorrowRequestDTO> pendingRequests = getAllRequests().stream()
                .filter(request -> collisionTime(request.getIntendedStartDate(), request.getIntendedReturnDate(),start,end)
                        && request.getStatus() == RequestStatus.PENDING)
                .collect(Collectors.toList());

        List<BorrowRequestDTO> redRequests = getAllRequests().stream()
                .filter(request -> collisionTime(request.getIntendedStartDate(), request.getIntendedReturnDate(),start,end)
                        && (request.getStatus() == RequestStatus.AWAITING_PICKUP || request.getStatus() == RequestStatus.AWAITING_RETURN))
                .collect(Collectors.toList());
        List<Long> itemIds= borrowRequest.getItemIds();

        HashMap<Long,Integer> pendingMap=new HashMap<>();
        HashMap<Long,Integer> redMap=new HashMap<>();
        for (Long id:itemIds) {
             int pendingCount=0;
             int redCount=itemService.getAllInstanceById(id).size();;
            for (BorrowRequestDTO pending:pendingRequests) {
                if (pending.getItemIds().indexOf(id) != 0)
                    pendingCount++;
            }

            for (BorrowRequestDTO red:redRequests) {
                if (red.getItemIds().indexOf(id) != 0)
                   redCount--;
            }
            pendingMap.put(id,pendingCount);
            redMap.put(id,redCount);
        }

        return AvailableCounts.builder().required(pendingMap).available(redMap).build();


    }

    public AvailableTime getAllStartTimeThatCanBeSelected(List<Long> itemIds, LocalDateTime localDateTime) {
        AvailableTime.itemIds=itemIds;
         HashMap<Long,AvailableTime> availableTimes=new HashMap<>();
        for (long itemId:itemIds) {
            List<ItemInstance> itemInstanceTable = itemInstanceService.findByItemTypeId(itemId);
            List<BorrowRequest> bendingBorrowRequestsTable = borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.PENDING);
            List<BorrowRequest> awaitingPickupBorrowRequestsTable = borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.AWAITING_PICKUP);
            List<BorrowRequest> awaitingReturnBorrowRequestsTable = borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.AWAITING_RETURN);
            availableTimes.put(itemId,startData(itemId,localDateTime,itemInstanceTable,awaitingReturnBorrowRequestsTable,awaitingPickupBorrowRequestsTable,bendingBorrowRequestsTable));
        }
        AvailableTime x = AvailableTime.BuildAvailableTimeFromList(availableTimes);
        return x;
    }



    private AvailableTime startData(long itemId, LocalDateTime startTime,List<ItemInstance> itemInstanceList, List<BorrowRequest> awaitingReturnBorrowRequestsTable, List<BorrowRequest> awaitingBorrowRequestsTable, List<BorrowRequest>  bendingBorrowRequestsTable)
    {
        LocalDateTime startDate = LocalDateTime.of(startTime.getYear(), startTime.getMonth(), startTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(startTime.getYear(), startTime.getMonth(), startTime.getDayOfMonth(), 23, 59);

        HashMap< LocalDateTime, List<ItemInstance>> data=new HashMap<>();
        List< LocalDateTime>bendinglist =new ArrayList<>();
        LocalDateTime currentDateTime = startDate;

        while (currentDateTime.isBefore(endDateTime)) {

            List<ItemInstance> availableIds = new ArrayList<>(itemInstanceList);
            for (BorrowRequest awaitingReturn : awaitingReturnBorrowRequestsTable) {
                LocalDateTime orderStart =  awaitingReturn.getIntendedStartDate();
                LocalDateTime orderEnd =  awaitingReturn.getIntendedReturnDate();

                if (between(currentDateTime,orderStart,orderEnd)){
                    List<Long> itemInstanceIds = awaitingReturn.getItemInstanceIds();
                    for (Long itemInstanceId : itemInstanceIds)
                        availableIds.removeAll(itemInstanceService.getInstancesById(itemInstanceId));
                }
            }
            int count=0;
            for(BorrowRequest awaitingborrowRequest:awaitingBorrowRequestsTable)
                if(between(currentDateTime,awaitingborrowRequest.getIntendedStartDate(),awaitingborrowRequest.getIntendedReturnDate()))
                    count++;

            if( availableIds.size()>count ){
                data.put(currentDateTime,availableIds);
                count=0;
                for(BorrowRequest bendingBorrowRequest:bendingBorrowRequestsTable)
                    if(between(currentDateTime,bendingBorrowRequest.getIntendedStartDate(),bendingBorrowRequest.getIntendedReturnDate()))
                        count++;
                if(availableIds.size()<=count)
                    bendinglist.add(currentDateTime);
            }

            currentDateTime = currentDateTime.plusMinutes(30);
        }
        HashMap<LocalDateTime,List<Long>> hashMapBendingList=new HashMap<>();
        for (LocalDateTime date:bendinglist)
            hashMapBendingList.put(date, Collections.singletonList(itemId));

        HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>> hashMapStartDay=new HashMap<>();

        for (LocalDateTime date:data.keySet()) {
            HashMap<Long,List<ItemInstance>> help= new HashMap<>();
            help.put(itemId,data.get(date));
            hashMapStartDay.put(date, help);
        }
        return AvailableTime.builder().bendingStartDates(hashMapBendingList).startDates(hashMapStartDay).build();
    }


    public boolean between(LocalDateTime current, LocalDateTime start, LocalDateTime end) {
        return current.isEqual(start) ||current.isEqual(end)   || (current.isAfter(start) && current.isBefore(end));
    }

    public boolean collisionTime(LocalDateTime time1start, LocalDateTime time1end, LocalDateTime time2start, LocalDateTime time2end) {
        return between(time1start,time2start,time2end) ||
                between(time1end,time2start,time2end) ||
                between( time2start,time1start,time1end)||
                between(time2end,time1start,time1end);
    }


    public AvailableTime getAllReturnTimeThatCanBeSelected(LocalDateTime localDateTimeStart, LocalDateTime localDateTimeReturn, HashMap<Long,List<ItemInstance>> data, List<Long> itemIds) {
        AvailableTime.itemIds=itemIds;
        AvailableTime.localDateTimeReturn=localDateTimeReturn;
        AvailableTime.localDateTimeStart=localDateTimeStart;
        HashMap<Long,AvailableTime> availableTimes=new HashMap<>();
        for (Long itemId:itemIds) {
            List<BorrowRequest> bendingBorrow = borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.PENDING);
            List<BorrowRequest> awaitingPickupBorrow = borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.AWAITING_PICKUP);
            availableTimes.put(itemId,returnData(itemId, localDateTimeStart, localDateTimeReturn, data.get(itemId), awaitingPickupBorrow, bendingBorrow));
        }
        AvailableTime x = AvailableTime.BuildAvailableTimeFromList(availableTimes);
        return x;
    }

    private  AvailableTime returnData(Long itemId, LocalDateTime selectStartTime, LocalDateTime localDateTimeEnd, List<ItemInstance> data,
                                     List<BorrowRequest> awaitingPickupBorrow, List<BorrowRequest> bendingBorrow) {

        LocalDateTime startDate ;
        if(selectStartTime.toLocalDate().isEqual(localDateTimeEnd.toLocalDate()))
            startDate = selectStartTime;
        else  startDate = LocalDateTime.of(localDateTimeEnd.getYear(), localDateTimeEnd.getMonth(), localDateTimeEnd.getDayOfMonth(), 0, 0);

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
                        if (schedule.isActive()) {
                            LocalDateTime orderStart = schedule.getIntendedStartDate();
                            LocalDateTime orderEnd = schedule.getIntendedReturnDate();

                            if (collisionTime(selectStartTime, currentDateTime, orderStart, orderEnd)) {
                                List<ItemInstance> help = new ArrayList<>();
                                for (ItemInstance instanceData : copydata)
                                    if (instanceData.getId() != schedule.getItemInstance().getId())
                                        help.add(instanceData);
                                copydata = new ArrayList<>(help);
                            }
                        }
                    }
                }
            }
            int count=0;
            for(BorrowRequest borrowRequestItem:awaitingPickupBorrow) {
                LocalDateTime start =  borrowRequestItem.getIntendedStartDate();
                LocalDateTime end = borrowRequestItem.getIntendedReturnDate();
                if(collisionTime(selectStartTime,currentDateTime,start,end))
                    count ++;
            }
            if (copydata.size() >count){
                localDateTimeList.add(currentDateTime);
                count=0;

                for(BorrowRequest borrowRequest:bendingBorrow) {
                    LocalDateTime start = borrowRequest.getIntendedStartDate();
                    LocalDateTime end = borrowRequest.getIntendedReturnDate();
                    if(collisionTime(selectStartTime,currentDateTime,start,end))
                        count ++;
                }
                if (copydata.size() <= count ) {
                    bendinglist.add(currentDateTime);
                }
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        HashMap<LocalDateTime,List<Long>> hashReturnData=new HashMap<>();
        for(LocalDateTime date:localDateTimeList)
            hashReturnData.put(date, Collections.singletonList(itemId));


        HashMap<LocalDateTime,List<Long>> hashBendingList=new HashMap<>();
        for(LocalDateTime date:bendinglist)
            hashBendingList.put(date, Collections.singletonList(itemId));

        return  AvailableTime.builder().returnDates(hashReturnData).bendingReturnDates(hashBendingList).build();
    }



}