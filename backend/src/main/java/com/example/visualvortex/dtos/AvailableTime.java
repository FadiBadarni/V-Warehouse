package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.Item.ItemInstance;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AvailableTime {
    public static List<Long> itemIds;
    public static LocalDateTime localDateTimeReturn;
    public static LocalDateTime localDateTimeStart;
    private HashMap<LocalDateTime, HashMap<Long, List<ItemInstance>>> startDates;
    private HashMap<LocalDateTime, List<Long>> bendingStartDates;
    private HashMap<LocalDateTime, List<Long>> redStartDate;
    private HashMap<LocalDateTime, List<Long>> incompleteStartDates;
    private HashMap<LocalDateTime, List<Long>> incompleteBendingStartDates;

    private HashMap<LocalDateTime, List<Long>> incompleteReturnDates;
    private HashMap<LocalDateTime, List<Long>> incompleteBendingReturnDates;
    private HashMap<LocalDateTime, List<Long>> returnDates;
    private HashMap<LocalDateTime, List<Long>> bendingReturnDates;
    private HashMap<LocalDateTime, List<Long>> redReturnDate;


    public static AvailableTime BuildAvailableTimeFromList(HashMap<Long, AvailableTime> availableTimes) {

        HashMap<LocalDateTime, HashMap<Long, List<ItemInstance>>> startDates = null;
        HashMap<LocalDateTime, List<Long>> bendingStartDates = null;
        HashMap<LocalDateTime, List<Long>> redStartDate = null;
        HashMap<LocalDateTime, List<Long>> incompleteStartDates = null;
        HashMap<LocalDateTime, List<Long>> incompleteBendingStartDates = null;

        HashMap<LocalDateTime, List<Long>> incompleteReturnDates = null;
        HashMap<LocalDateTime, List<Long>> incompleteBendingReturnDates = null;
        HashMap<LocalDateTime, List<Long>> returnDates = null;
        HashMap<LocalDateTime, List<Long>> bendingReturnDates = null;
        HashMap<LocalDateTime, List<Long>> redReturnDate = null;
        if (availableTimes.values().stream().iterator().next().getStartDates() != null) {
            startDates = buildStartDates(availableTimes);
            redStartDate = buildRedDate(startDates);
            bendingStartDates = multiBindingStartDates(availableTimes);
            incompleteStartDates = buildIncompleteStartDates(startDates);
            incompleteBendingStartDates = buildIncompleteBendingStartDates(availableTimes);
        } else {
            returnDates = buildReturnDates(availableTimes);
            redReturnDate = buildReturnRedDate(availableTimes);
            bendingReturnDates = buildBendingReturnDates(availableTimes);
            incompleteReturnDates = buildIncompleteReturnDates(returnDates);
            incompleteBendingReturnDates = buildIncompleteBendingReturnDates(availableTimes);
        }


        return AvailableTime.builder().startDates(startDates).
                bendingStartDates(bendingStartDates).
                incompleteStartDates(incompleteStartDates)
                .bendingReturnDates(bendingReturnDates)
                .redStartDate(redStartDate)
                .incompleteBendingStartDates(incompleteBendingStartDates)

                .returnDates(returnDates)
                .redReturnDate(redReturnDate)
                .bendingReturnDates(bendingReturnDates)
                .incompleteReturnDates(incompleteReturnDates)
                .incompleteBendingReturnDates(incompleteBendingReturnDates)
                .build();

    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteBendingReturnDates(HashMap<Long, AvailableTime> availableTimes) {
        //كل الاوقات الي فهيا اكثر من عنصر اصفر بس مش الكل
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = localDateTimeReturn;
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count = 0;
            for (Long availableTime : availableTimes.keySet()) {
                HashMap<LocalDateTime, List<Long>> x = availableTimes.get(availableTime).getBendingReturnDates();
                List<Long> y = x.get(currentDateTime);
                if (y != null) {
                    count += y.size();
                }
            }
            if (count < itemIds.size() && count > 0) {
                map.put(currentDateTime, itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildBendingReturnDates(HashMap<Long, AvailableTime> availableTimes) {
//كل الاوقات الي فهيا كل النسخ اصفر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = localDateTimeReturn;
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count = 0;
            for (Long availableTime : availableTimes.keySet()) {
                HashMap<LocalDateTime, List<Long>> x = availableTimes.get(availableTime).getBendingReturnDates();
                List<Long> y = x.get(currentDateTime);
                if (y != null) {
                    count += y.size();
                }
            }
            if (count == itemIds.size()) {
                map.put(currentDateTime, itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteReturnDates(HashMap<LocalDateTime, List<Long>> returnDates) {
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = localDateTimeReturn;
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            if (returnDates.get(currentDateTime) != null && returnDates.get(currentDateTime).size() < itemIds.size()) {
                List<Long> help = new ArrayList<>(itemIds);
                help.removeAll(returnDates.get(currentDateTime));
                map.put(currentDateTime, help);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildReturnRedDate(HashMap<Long, AvailableTime> availableTimes) {
        //كل اوقات الي موجود فيها عنصر واحد او اكثر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = localDateTimeReturn;
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count = 0;
            for (Long availableTime : availableTimes.keySet()) {
                HashMap<LocalDateTime, List<Long>> x = availableTimes.get(availableTime).getReturnDates();
                List<Long> y = x.get(currentDateTime);
                if (y != null) {
                    count += y.size();
                }
            }
            if (count == 0) {
                map.put(currentDateTime, itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildReturnDates(HashMap<Long, AvailableTime> availableTimes) {

        //كل اوقات الي موجود فيها عنصر واحد او اكثر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = localDateTimeReturn;
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count = 0;
            List<Long> ids = new ArrayList<>();
            for (Long availableTime : availableTimes.keySet()) {

                List<Long> x = availableTimes.get(availableTime).getReturnDates().get(currentDateTime);
                if (x != null) {
                    ids.addAll(x);
                }
            }
            if (ids.size() >= 1) {

                map.put(currentDateTime, ids);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteBendingStartDates(HashMap<Long, AvailableTime> availableTimes) {

        //كل الاوقات الي فهيا اكثر من عنصر اصفر بس مش الكل
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = availableTimes.values().stream().iterator().next().getStartDates().keySet().iterator().next();
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count = 0;
            List<Long> pending = new ArrayList<>();
            for (Long availableTime : availableTimes.keySet()) {

                HashMap<LocalDateTime, List<Long>> x = availableTimes.get(availableTime).getBendingStartDates();
                List<Long> y = x.get(currentDateTime);
                if (y != null) {
                    count += y.size();
                    pending.add(availableTime);
                }
            }
            if (count < itemIds.size() && count > 0) {

                map.put(currentDateTime, pending);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildRedDate(HashMap<LocalDateTime, HashMap<Long, List<ItemInstance>>> startDates) {

        //كل الاوقات الي فيها على الاقل نسخه متوفره
        HashMap<LocalDateTime, List<Long>> redDate = new HashMap<>();
        LocalDateTime localDateTime = startDates.keySet().iterator().next();
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            if (!startDates.containsKey(currentDateTime))
                redDate.put(currentDateTime, itemIds);
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return redDate;
    }

    private static HashMap<LocalDateTime, HashMap<Long, List<ItemInstance>>> buildStartDates(HashMap<Long, AvailableTime> availableTimes) {

        //كل اوقات الي موجود فيها عنصر واحد او اكثر
        HashMap<LocalDateTime, HashMap<Long, List<ItemInstance>>> startDates = new HashMap<>();
        for (AvailableTime availableTime : availableTimes.values()) {
            for (LocalDateTime localDateTimeKey : availableTime.getStartDates().keySet()) {
                if (startDates.containsKey(localDateTimeKey)) {
                    HashMap<Long, List<ItemInstance>> x = availableTime.getStartDates().get(localDateTimeKey);
                    HashMap<Long, List<ItemInstance>> y = startDates.get(localDateTimeKey);
                    HashMap<Long, List<ItemInstance>> total = new HashMap<>(x);
                    total.putAll(y);
                    startDates.put(localDateTimeKey, total);
                } else {
                    startDates.put(localDateTimeKey, availableTime.getStartDates().get(localDateTimeKey));
                }
            }
        }
        return startDates;
    }

    private static HashMap<LocalDateTime, List<Long>> multiBindingStartDates(HashMap<Long, AvailableTime> availableTimes) {
//كل الاوقات الي فهيا كل النسخ اصفر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = availableTimes.values().stream().iterator().next().getStartDates().keySet().iterator().next();
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count = 0;
            for (Long keys : availableTimes.keySet()) {
                HashMap<LocalDateTime, List<Long>> x = availableTimes.get(keys).getBendingStartDates();
                List<Long> y = x.get(currentDateTime);
                if (y != null) {
                    count += y.size();
                }
            }
            if (count == itemIds.size()) {
                map.put(currentDateTime, itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteStartDates(HashMap<LocalDateTime, HashMap<Long, List<ItemInstance>>> startDates) {

        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime = startDates.keySet().iterator().next();
        LocalDateTime currentDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            if (startDates.get(currentDateTime) != null && startDates.get(currentDateTime).size() < itemIds.size()) {
                List<Long> help = new ArrayList<>(itemIds);
                help.removeAll(startDates.get(currentDateTime).keySet());

                map.put(currentDateTime, help);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

}
