package com.example.visualvortex.dtos;


import lombok.*;

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
    private boolean isAvailable;
    private ItemTypeAttributeDTO itemType;
}
