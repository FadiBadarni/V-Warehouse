package com.example.visualvortex.dtos.ItemDTOS;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemTypeDTO {
    private long id;
    private String name;
    private Set<ItemAttributeDTO> attributes;
}
