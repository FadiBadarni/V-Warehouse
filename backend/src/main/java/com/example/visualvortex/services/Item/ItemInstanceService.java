package com.example.visualvortex.services.Item;


import com.example.visualvortex.dtos.ItemDTOS.AvailableInstanceQuantity;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.entities.Item.ItemState;
import com.example.visualvortex.entities.Request.BorrowRequest;
import com.example.visualvortex.entities.Request.RequestStatus;
import com.example.visualvortex.entities.Schedule;
import com.example.visualvortex.repositories.BorrowRequestRepository;
import com.example.visualvortex.repositories.ItemInstanceRepository;
import com.example.visualvortex.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemInstanceService {

    private final ItemInstanceRepository itemInstanceRepository;
    private final ScheduleRepository scheduleRepository;
    private final BorrowRequestRepository borrowRequestRepository;

    public List<ItemInstanceDTO> getAllItemInstances() {
        List<ItemInstance> itemInstances = itemInstanceRepository.findAll();

        return itemInstances.stream()
                .map(instance -> new ItemInstanceDTO(
                        instance.getId(),
                        instance.getState(),
                        instance.getItem().getId()))
                .collect(Collectors.toList());
    }

    public List<ItemInstance> getAvailableInstances(Long itemId, List<Long> itemInstanceIds) {
        List<ItemInstance> allInstances = itemInstanceRepository.findAllByItemId(itemId);
        List<ItemInstance> availableInstances = new ArrayList<>();

        for (ItemInstance instance : allInstances) {
            if (instance.getState() != ItemState.AVAILABLE) {
                continue;
            }

            LocalDateTime now = LocalDateTime.now();
            List<Schedule> instanceSchedules = scheduleRepository.findAllByItemInstanceId(instance.getId());

            boolean isAvailable = instanceSchedules.stream()
                    .noneMatch(schedule -> schedule.getIntendedStartDate().isBefore(now)
                            && schedule.getIntendedReturnDate().isAfter(now));

            if (isAvailable) {
                availableInstances.add(instance);
            }

            if (availableInstances.size() >= itemInstanceIds.size()) {
                break;
            }

        }

        return availableInstances;
    }

    public List<ItemInstance> getInstancesByIds(List<Long> instanceIds) {
        return itemInstanceRepository.findAllById(instanceIds);
    }


    public int quantityItemsBy(Long id) {
        return itemInstanceRepository.quantityItemsBy(id);

    }

    public int countItemInstancesByItemId(Long itemId)
    {
        return itemInstanceRepository.countItemInstancesByItemId(itemId);
    }

    public int countItemInstancesByItemIdAndIntendedDates(Long itemId, Date intendedStartDate, Date intendedReturnDate){
        return itemInstanceRepository.countItemInstancesByItemIdAndIntendedDates(itemId,intendedStartDate, intendedReturnDate);
    }

    public List<ItemInstance> findAll() {
        return itemInstanceRepository.findAll();
    }

    public List<ItemInstance> getInstancesById(long id) {
        return itemInstanceRepository.findAllByItemId(id);
    }

    public List<ItemInstance> findByItemTypeId(long id) {
        return itemInstanceRepository.findAllByItemId(id);
    }

    public AvailableInstanceQuantity getAvailableQuantity(Long itemId, String startDate, String returnDate) {
        List<ItemInstance>   itemInstanceList=itemInstanceRepository.findAllByItemId(itemId);
        List<Long> idList = new ArrayList<>(itemInstanceList.stream()
                .filter(itemInstance -> itemInstance.getState() == ItemState.AVAILABLE)
                .map(ItemInstance::getId)
                .toList());

        LocalDateTime startDateO = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        LocalDateTime returnDateO = LocalDateTime.parse(returnDate, DateTimeFormatter.ISO_DATE_TIME).plusHours(3);
        List<Schedule>  scheduleList=scheduleRepository.findByItemTypeId(itemId);
        List<BorrowRequest>  borrowRequestsPENDING=borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.PENDING);
        List<BorrowRequest>  borrowRequestsAWAITINGPICKUP=borrowRequestRepository.findRequestsByItemIdAndStatus(itemId, RequestStatus.AWAITING_PICKUP);

        for (Schedule schedule:scheduleList) {
            if(schedule.isActive()) {
                LocalDateTime scheduleReturnDate = schedule.getIntendedReturnDate();
                LocalDateTime scheduleStartDate = schedule.getIntendedStartDate();
                if (collisionTime(startDateO,returnDateO, scheduleStartDate,scheduleReturnDate)) {
                    idList.remove(schedule.getItemInstance().getId());
                }
            }
        }

        int count =0;
        for (BorrowRequest borrowRequest: borrowRequestsAWAITINGPICKUP) {
            LocalDateTime scheduleReturnDate=borrowRequest.getIntendedReturnDate();
            LocalDateTime scheduleStartDate =borrowRequest.getIntendedStartDate();
            if (collisionTime(startDateO,returnDateO, scheduleStartDate,scheduleReturnDate))
                count += borrowRequest.getQuantity();
        }
        int pendingCount=0;
        for (BorrowRequest borrowRequest: borrowRequestsPENDING) {
            LocalDateTime scheduleReturnDate=borrowRequest.getIntendedReturnDate();
            LocalDateTime scheduleStartDate =borrowRequest.getIntendedStartDate();
            if (collisionTime(startDateO,returnDateO, scheduleStartDate,scheduleReturnDate))
                pendingCount += borrowRequest.getQuantity();
        }


        return AvailableInstanceQuantity.builder().availableQuantity(idList.size()-count)
                .pendingQuantity(pendingCount).availableItemsIds(idList).build();
    }

    public boolean between(LocalDateTime current, LocalDateTime start, LocalDateTime end) {
        return current.isEqual(start)  || (current.isAfter(start) && current.isBefore(end));
    }

    public boolean collisionTime(LocalDateTime time1start, LocalDateTime time1end, LocalDateTime time2start, LocalDateTime time2end) {

        return between(time1start,time2start,time2end) ||
                between(time1end,time2start,time2end) ||
                between( time2start,time1start,time1end)||
                between(time2end,time1start,time1end);
    }

}
