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
    public static  List<Long> itemIds;
    private  HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>> startDates;
    private  HashMap<LocalDateTime,List<Long>> bendingStartDates;
    private  List<LocalDateTime> redStartDate;
    private  HashMap<LocalDateTime,List<Long>> incompleteStartDates;
    private  HashMap<LocalDateTime,List<Long>> incompleteBendingStartDates;

    private  HashMap<LocalDateTime,List<Long>> incompleteReturnDates;
    private  HashMap<LocalDateTime,List<Long>> incompleteBendingReturnDates;
    private  HashMap<LocalDateTime,List<Long>> returnDates;
    private  HashMap<LocalDateTime,List<Long>>  bendingReturnDates;
    private  List<LocalDateTime> redReturnDate;





    public static AvailableTime BuildAvailableTimeFromList(List<AvailableTime> availableTimes)
    {

         HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>> startDates=null;
        HashMap<LocalDateTime,List<Long>> bendingStartDates=null;
        List<LocalDateTime> redStartDate=null;
        HashMap<LocalDateTime,List<Long>> incompleteStartDates=null;
        HashMap<LocalDateTime,List<Long>> incompleteBendingStartDates=null;

        HashMap<LocalDateTime,List<Long>> incompleteReturnDates=null;
        HashMap<LocalDateTime,List<Long>> incompleteBendingReturnDates=null;
       HashMap<LocalDateTime,List<Long>> returnDates=null;
        HashMap<LocalDateTime,List<Long>>  bendingReturnDates=null;
        List<LocalDateTime> redReturnDate=null;
        if(availableTimes.get(0).getStartDates()!=null) {
            startDates = buildStartDates(availableTimes);
            redStartDate = buildRedDate(startDates);
            bendingStartDates = multiBindingStartDates(availableTimes);
            incompleteStartDates = buildIncompleteStartDates(startDates);
            incompleteBendingStartDates = buildIncompleteBendingStartDates(availableTimes);
        }else {
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
                . incompleteReturnDates( incompleteReturnDates)
                .incompleteBendingReturnDates(incompleteBendingReturnDates)
                .build();

    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteBendingReturnDates(List<AvailableTime> availableTimes) {
        //كل الاوقات الي فهيا اكثر من عنصر اصفر بس مش الكل
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=availableTimes.get(0).getReturnDates().keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count=0;
            for (AvailableTime availableTime : availableTimes)
            {
                HashMap<LocalDateTime, List<Long>> x = availableTime.getBendingReturnDates();
                List<Long> y = x.get(currentDateTime);
                if(y!=null) {
                    count += y.size();
                }
            }
            if(count<itemIds.size() && count>0)
            {
                map.put(currentDateTime,itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildBendingReturnDates(List<AvailableTime> availableTimes) {
//كل الاوقات الي فهيا كل النسخ اصفر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=availableTimes.get(0).getReturnDates().keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count=0;
            for (AvailableTime availableTime : availableTimes)
            {
                HashMap<LocalDateTime, List<Long>> x = availableTime.getBendingReturnDates();
                List<Long> y = x.get(currentDateTime);
                if(y!=null) {
                    count += y.size();
                }
            }
            if(count==itemIds.size())
            {
                map.put(currentDateTime,itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteReturnDates(HashMap<LocalDateTime, List<Long>> returnDates) {
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=returnDates.keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            if(returnDates.get(currentDateTime).size() > itemIds.size())
            {
                List<Long> help=new ArrayList<>(itemIds);
                help.removeAll(returnDates.get(currentDateTime));
                map.put(currentDateTime,help);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static List<LocalDateTime> buildReturnRedDate(List<AvailableTime> availableTimes) {
        //كل اوقات الي موجود فيها عنصر واحد او اكثر
        List<LocalDateTime> map = new ArrayList<>();
        LocalDateTime localDateTime=availableTimes.get(0).getReturnDates().keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count=0;
            for (AvailableTime availableTime : availableTimes)
            {
                HashMap<LocalDateTime, List<Long>> x = availableTime.getReturnDates();
                List<Long> y = x.get(currentDateTime);
                if(y!=null) {
                    count += y.size();
                }
            }
            if(count==0)
            {
                map.add(currentDateTime);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildReturnDates(List<AvailableTime> availableTimes) {

        //كل اوقات الي موجود فيها عنصر واحد او اكثر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=availableTimes.get(0).getReturnDates().keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count=0;
            List<Long> ids= new ArrayList<>();
            for (AvailableTime availableTime : availableTimes)
            {

                List<Long> x = availableTime.getReturnDates().get(currentDateTime);
                ids.addAll(x);
            }
            if(ids.size()>=1)
            {

                map.put(currentDateTime,ids);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static HashMap<LocalDateTime, List<Long>> buildIncompleteBendingStartDates(List<AvailableTime> availableTimes) {

        //كل الاوقات الي فهيا اكثر من عنصر اصفر بس مش الكل
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=availableTimes.get(0).getStartDates().keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count=0;
            for (AvailableTime availableTime : availableTimes)
            {
                HashMap<LocalDateTime, List<Long>> x = availableTime.getBendingStartDates();
                List<Long> y = x.get(currentDateTime);
                if(y!=null) {
                    count += y.size();
                }
            }
            if(count<itemIds.size() && count>0)
            {
                map.put(currentDateTime,itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private static List<LocalDateTime> buildRedDate(HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>> startDates) {

        //كل الاوقات الي فيها على الاقل نسخه متوفره
        List<LocalDateTime> redDate=new ArrayList<>();
        LocalDateTime localDateTime=startDates.keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            if (!startDates.containsKey(currentDateTime))
                redDate.add(currentDateTime);
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return redDate;
    }

    private static    HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>>  buildStartDates(List<AvailableTime> availableTimes)
    {

        //كل اوقات الي موجود فيها عنصر واحد او اكثر
        HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>>  startDates = new HashMap<>();
        for (AvailableTime availableTime :availableTimes) {
            for(LocalDateTime localDateTimeKey:availableTime.getStartDates().keySet())
            {
                if (startDates.containsKey(localDateTimeKey)) {
                    HashMap<Long,List<ItemInstance>> x = availableTime.getStartDates().get(localDateTimeKey);
                    HashMap<Long,List<ItemInstance>> y = startDates.get(localDateTimeKey);
                    HashMap<Long,List<ItemInstance>> total = new HashMap<>(x);
                    total.putAll(y);
                    startDates.put(localDateTimeKey, total);
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
//كل الاوقات الي فهيا كل النسخ اصفر
        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=availableTimes.get(0).getStartDates().keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
            int count=0;
            for (AvailableTime availableTime : availableTimes)
            {
                HashMap<LocalDateTime, List<Long>> x = availableTime.getBendingStartDates();
                List<Long> y = x.get(currentDateTime);
                if(y!=null) {
                    count += y.size();
                }
            }
            if(count==itemIds.size())
            {
                map.put(currentDateTime,itemIds);
            }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

    private  static  HashMap<LocalDateTime,List<Long>> buildIncompleteStartDates(HashMap<LocalDateTime, HashMap<Long,List<ItemInstance>>>  startDates)
    {

        HashMap<LocalDateTime, List<Long>> map = new HashMap<>();
        LocalDateTime localDateTime=startDates.keySet().iterator().next();
        LocalDateTime currentDateTime  = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime endDateTime = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 23, 59);
        while (currentDateTime.isBefore(endDateTime)) {
          if(startDates.get(currentDateTime).size() > itemIds.size())
          {
              List<Long> help=new ArrayList<>(itemIds);
              for (Long l:startDates.get(currentDateTime).keySet()) {
                  help.removeAll(startDates.get(currentDateTime).get(l));
              }
             map.put(currentDateTime,help);
          }
            currentDateTime = currentDateTime.plusMinutes(30);
        }
        return map;
    }

}
