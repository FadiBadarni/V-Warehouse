package com.example.visualvortex.controllers.WarehouseControllers;

import com.example.visualvortex.dtos.ItemDTO;
import com.example.visualvortex.dtos.ItemTypeAttributeDTO;
import com.example.visualvortex.entities.Item;
import com.example.visualvortex.repositories.ItemTypeAttributeRepository;
import com.example.visualvortex.services.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping("/warehouseItems")
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        List<ItemDTO> itemDTOs = items.stream().map(this::toDTO).collect(Collectors.toList());
        return new ResponseEntity<>(itemDTOs, HttpStatus.OK);
    }

    @GetMapping("/warehouseItems/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        ItemDTO itemDTO = toDTO(item);
        return new ResponseEntity<>(itemDTO, HttpStatus.OK);
    }

    private ItemDTO toDTO(Item item) {
        ItemTypeAttributeDTO itemTypeDTO = ItemTypeAttributeDTO.builder()
                .id(item.getItemType().getId())
                .name(item.getItemType().getName())
                .build();

        return ItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .isAvailable(true)
                .itemType(itemTypeDTO)
                .build();
    }
}