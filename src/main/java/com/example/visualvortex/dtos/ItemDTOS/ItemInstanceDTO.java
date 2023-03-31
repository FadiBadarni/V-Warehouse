package com.example.visualvortex.dtos.ItemDTOS;

import com.example.visualvortex.entities.Item.ItemState;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemInstanceDTO {
    private long id;
    private ItemState state;
    private long itemId;
}