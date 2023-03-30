package com.example.visualvortex.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemAttributeDTO {
    private long id;
    private String attributeName;
    private String attributeValue;
    private ItemTypeAttributeDTO itemType;
}
