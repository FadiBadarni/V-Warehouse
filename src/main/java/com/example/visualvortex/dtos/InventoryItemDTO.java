package com.example.visualvortex.dtos;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InventoryItemDTO {
    private long id;
    private String name;
    private String description;
    private int quantity;
    private String type;
    private String safetyInstructions;
    private String accompanyingEquipment;
}
