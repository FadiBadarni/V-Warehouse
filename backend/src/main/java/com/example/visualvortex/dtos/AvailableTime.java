package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.entities.Item.ItemInstance;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AvailableTime {
    public static  List<Long> itemIds;
    private  HashMap<LocalDateTime, List<List<ItemInstance>>> startDates;
    private  HashMap<LocalDateTime,List<Long>> bendingStartDates;
    private  HashMap<LocalDateTime,List<Long>> returnDates;
    private  HashMap<LocalDateTime,List<Long>>  bendingReturnDates;
    private  HashMap<LocalDateTime,List<Long>> incompleteStartDates;
    private  HashMap<LocalDateTime,List<Long>> incompleteReturnDates;


    public static AvailableTime BuildAvailableTimeFromList(List<AvailableTime> availableTimes)
    {
        HashMap<LocalDateTime, List<List<ItemInstance>>> startDates = buildStartDates(availableTimes);
        HashMap<LocalDateTime,List<Long>> bendingStartDates= multiBindingStartDates(availableTimes);
        HashMap<LocalDateTime,List<Long>> incompleteStartDates=buildIncompleteStartDates(availableTimes);
        HashMap<LocalDateTime,List<Long>> returnDates =multiBindingStartDates(availableTimes);
        HashMap<LocalDateTime,List<Long>> bendingReturnDates=multiBindingStartDates(availableTimes);
        return AvailableTime.builder().startDates(startDates).
                bendingStartDates(bendingStartDates).
                returnDates(returnDates).
                incompleteStartDates(incompleteStartDates)
                        .incompleteReturnDates(null)
                                .bendingReturnDates(bendingReturnDates)
                                        .build();

    }

    private static    HashMap<LocalDateTime, List<List<ItemInstance>>>  buildStartDates(List<AvailableTime> availableTimes)
    {

        HashMap<LocalDateTime, List<List<ItemInstance>>>  startDates = new HashMap<>();
        for (AvailableTime availableTime :availableTimes) {
            for(LocalDateTime localDateTimeKey:availableTime.getStartDates().keySet())
            {
                if (startDates.containsKey(localDateTimeKey)) {
                    List<List<ItemInstance>> x = availableTime.getStartDates().get(localDateTimeKey);
                    List<List<ItemInstance>> y = startDates.get(localDateTimeKey);
                    List<List<ItemInstance>> total = new ArrayList<>();
                    for (List<ItemInstance> list : x) {
                        if (!y.contains(list)) {
                            total.add(list);
                        }
                    }
                    startDates.put(localDateTimeKey, new ArrayList<>(total));
                }

                else {
                    startDates.put(localDateTimeKey,availableTime.getStartDates().get(localDateTimeKey));
                }
            }
        }
        return  startDates;
    }

    private  static   HashMap<LocalDateTime, List<Long>> multiBindingStartDates(List<AvailableTime> availableTimes)
    {
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        for (AvailableTime time : availableTimes)
            for (LocalDateTime date:time.getBendingStartDates().keySet())
                if(time.getBendingStartDates().get(date).size()==itemIds.size())
                    map.put(date,itemIds);
        return map;
    }

    private  static  HashMap<LocalDateTime,List<Long>> buildIncompleteStartDates(List<AvailableTime> availableTimes)
    {
        HashMap<LocalDateTime,List<Long>> allDates= getUniqueStartDates(availableTimes);
        HashMap<LocalDateTime,List<Long>> allBending=  getBendingStartDatesWithAtMostNMatches(availableTimes);
        allDates.putAll(allBending);
        return  allDates;
    }


    private static HashMap<LocalDateTime, List<Long>> getBendingStartDatesWithAtMostNMatches(List<AvailableTime> availableTimes) {
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        for (AvailableTime time : availableTimes)
            for (LocalDateTime date:time.getBendingStartDates().keySet())
                if(time.getBendingStartDates().get(date).size()<itemIds.size()) {
                    map.put(date, itemIds.stream().filter(id -> !time.getBendingStartDates().get(date).contains(id)).collect(Collectors.toList()));
                }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> getUniqueStartDates(List<AvailableTime> availableTimes) {


        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        for (AvailableTime time : availableTimes)
            for (LocalDateTime date:time.getBendingStartDates().keySet())
                if(time.getStartDates().get(date).size()<itemIds.size()) {

                    List <Long> ids=new ArrayList<>();
                    for(List<ItemInstance> instance:time.getStartDates().get(date))
                    {
                      ids.add(instance.get(0).getItem().getItemType().getId());
                    }

                    map.put(date, itemIds.stream().filter(id -> !ids.contains(id)).collect(Collectors.toList()));
                }
        return map;
    }

}
