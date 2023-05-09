package com.example.visualvortex.dtos.ItemDTOS;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemDTO {
    private Long instanceId;
    private String instanceState;
    private String instanceType;
}
