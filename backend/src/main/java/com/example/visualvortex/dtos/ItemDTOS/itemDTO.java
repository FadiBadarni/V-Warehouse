package com.example.visualvortex.dtos.ItemDTOS;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class itemDTO {
    private long id;
    private String name;
    private String description;
    private boolean takeOut;
    private int quantity;
    private ItemTypeDTO itemType;
    private List<ItemInstanceDTO> itemInstances;
}