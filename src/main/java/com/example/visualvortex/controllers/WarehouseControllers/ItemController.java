package com.example.visualvortex.controllers.WarehouseControllers;

import com.example.visualvortex.dtos.ItemDTOS.ItemDTO;
import com.example.visualvortex.entities.Item.ItemState;
import com.example.visualvortex.dtos.ItemDTOS.ItemTypeDTO;
import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.services.Item.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ItemController {
    private final ItemService itemService;

    @GetMapping("/warehouseItems")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemDTO> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return items.stream()
                .map(itemService::itemToItemDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/warehouseItems/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ItemDTO getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        return itemService.itemToItemDTO(item);
    }


}
