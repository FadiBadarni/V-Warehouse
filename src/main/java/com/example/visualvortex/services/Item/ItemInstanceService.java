package com.example.visualvortex.services.Item;


import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.entities.Item.ItemState;
import com.example.visualvortex.entities.Schedule;
import com.example.visualvortex.repositories.ItemInstanceRepository;
import com.example.visualvortex.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemInstanceService {

    private final ItemInstanceRepository itemInstanceRepository;
    private final ScheduleRepository scheduleRepository;

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

    public List<Object[]> findScheduleIdsByItemIdAndDate(long itemId, LocalDate date)
    {
//        LocalDate localDate= LocalDate.parse(date);
        return  itemInstanceRepository. findItemInstancesByItemIdAndDate(itemId, date,date.plusDays(1));
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
}