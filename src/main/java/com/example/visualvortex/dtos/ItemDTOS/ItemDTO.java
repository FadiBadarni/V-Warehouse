package com.example.visualvortex.dtos.ItemDTOS;


import com.example.visualvortex.entities.Item.ItemState;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemDTO {
    private long id;
    private String name;
    private String description;
    private int quantity;
    private ItemTypeDTO itemType;
    private List<ItemInstanceDTO> itemInstances;
}
