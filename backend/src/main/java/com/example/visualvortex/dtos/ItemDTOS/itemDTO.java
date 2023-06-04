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
    private  boolean forBorrow;
    private String name;
    private String description;
    private int quantity;
    private ItemTypeDTO itemType;
    private List<ItemInstanceDTO> itemInstances;
}