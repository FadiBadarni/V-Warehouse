package com.example.visualvortex.dtos.ItemDTOS;


import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InstanceDTO {
    private Long serialNumber;
    private String name;
    private String description;
    private boolean takeOut;
    private ItemTypeDTO itemType;
    private String img;
}