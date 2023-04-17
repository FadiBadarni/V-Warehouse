package com.example.visualvortex.controllers.WarehouseControllers;

import com.example.visualvortex.dtos.ItemDTOS.ItemDTO;
import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.services.Item.ItemInstanceService;
import com.example.visualvortex.services.Item.ItemService;
import com.example.visualvortex.services.Item.ItemTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ItemController {
    private final ItemService itemService;

    private final ItemTypeService itemTypeService;

    private final ItemInstanceService itemInstanceService;

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

    @GetMapping("itemTypes")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getItemById() {
        List<String> t = itemTypeService.listType();
        return itemTypeService.listType();
    }

    @GetMapping("/quantityItemsByType/{id}")
    @ResponseStatus(HttpStatus.OK)
    public int quantityItemsByType(@PathVariable Long id) {

        int x= itemInstanceService.quantityItemsBy(id);
        return  x;
    }

}
