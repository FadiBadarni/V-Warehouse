package com.example.visualvortex.controllers.WarehouseControllers;

import com.example.visualvortex.dtos.InventoryItemDTO;
import com.example.visualvortex.entities.InventoryItem;
import com.example.visualvortex.services.InventoryItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class InventoryItemController {
    @Autowired
    private InventoryItemService inventoryItemService;

    @GetMapping("/warehouseItems")
    public ResponseEntity<List<InventoryItemDTO>> getAllItems() {
        List<InventoryItem> items = inventoryItemService.getAllInventoryItems();
        List<InventoryItemDTO> itemDTOs = items.stream().map(this::toDTO).collect(Collectors.toList());
        return new ResponseEntity<>(itemDTOs, HttpStatus.OK);
    }

    @GetMapping("/warehouseItems/{id}")
    public ResponseEntity<InventoryItemDTO> getItemById(@PathVariable Long id) {
        InventoryItem item = inventoryItemService.getInventoryItemById(id);
        InventoryItemDTO itemDTO = toDTO(item);
        return new ResponseEntity<>(itemDTO, HttpStatus.OK);
    }


    private InventoryItemDTO toDTO(InventoryItem item) {
        return InventoryItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .type(item.getType())
                .safetyInstructions(item.getSafetyInstructions())
                .accompanyingEquipment(item.getAccompanyingEquipment())
                .build();
    }
}