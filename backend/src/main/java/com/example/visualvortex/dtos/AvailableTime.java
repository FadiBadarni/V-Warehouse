package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.Item.ItemInstance;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AvailableTime {
    private HashMap<LocalDateTime, List<ItemInstance>> startDates;
    private  List<LocalDateTime> bendingStartDates;
    private List<LocalDateTime> returnDates;
    private  List<LocalDateTime> bendingReturnDates;
}
