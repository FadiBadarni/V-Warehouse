package com.example.visualvortex.dtos;

import lombok.*;

import java.util.HashMap;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AvailableCounts {

    private HashMap<Long,Integer> required;
     private HashMap<Long,Integer> available;
}
