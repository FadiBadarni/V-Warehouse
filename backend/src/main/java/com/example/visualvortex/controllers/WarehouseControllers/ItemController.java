package com.example.visualvortex.controllers.WarehouseControllers;

import com.example.visualvortex.dtos.ItemDTOS.itemDTO;
import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.services.Item.ItemInstanceService;
import com.example.visualvortex.services.Item.ItemService;
import com.example.visualvortex.services.Item.ItemTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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
    public List<itemDTO> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return items.stream()
                .filter(Item::isForBorrow).map(itemService::itemToItemDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/warehouseItems/{id}")
    @ResponseStatus(HttpStatus.OK)
    public itemDTO getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        return itemService.itemToItemDTO(item);
    }

    @GetMapping("/warehouseItemsByIds")
    @ResponseStatus(HttpStatus.OK)
    public List<itemDTO> getItemsByIds(@RequestParam("ids") List<Long> ids) {
        List<Item> items = itemService.getItemsByIds(ids);
        return items.stream()
                .map(itemService::itemToItemDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("itemTypes")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getItemById() {
        return itemTypeService.listType();
    }


    //delete
    @GetMapping("/quantityItemsByType/{id}")
    @ResponseStatus(HttpStatus.OK)
    public int quantityItemsByType(@PathVariable Long id) {

        return itemInstanceService.quantityItemsBy(id);
    }


    //delete
    @GetMapping("/countItemInstancesByItemId/{id}")
    @ResponseStatus(HttpStatus.OK)
    public long countItemInstancesByItemId(@PathVariable Long id) {
        return itemInstanceService.countItemInstancesByItemId(id);
    }


    //delete
    @GetMapping("/countItemInstancesByItemIdAndIntendedDates/{id}")
    @ResponseStatus(HttpStatus.OK)
    public long countItemInstancesByItemIdAndIntendedDates(@PathVariable Long id) {
        return itemInstanceService.countItemInstancesByItemIdAndIntendedDates(id, new Date(123), new Date(1123));
    }




}
