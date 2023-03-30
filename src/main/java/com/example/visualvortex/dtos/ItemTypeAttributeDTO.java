package com.example.visualvortex.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemTypeAttributeDTO {
    private long id;
    private String name;
    private Set<ItemAttributeDTO> attributes;
}