package com.example.visualvortex.controllers.WarehouseControllers;

import com.example.visualvortex.dtos.ItemDTOS.ItemDTO;
import com.example.visualvortex.entities.Item.ItemState;
import com.example.visualvortex.dtos.ItemDTOS.ItemTypeDTO;
import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.services.Item.ItemInstanceService;
import com.example.visualvortex.services.Item.ItemService;
import com.example.visualvortex.services.Item.ItemTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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
        return itemTypeService.listType();
    }

    @GetMapping("/quantityItemsByType/{id}")
    @ResponseStatus(HttpStatus.OK)
    public int quantityItemsByType(@PathVariable Long id) {

        return itemInstanceService.quantityItemsBy(id);
    }
    @GetMapping("/countItemInstancesByItemId/{id}")
    @ResponseStatus(HttpStatus.OK)
    public long  countItemInstancesByItemId(@PathVariable Long id) {
        return  itemInstanceService.countItemInstancesByItemId(id);
    }


    @GetMapping("/countItemInstancesByItemIdAndIntendedDates/{id}")
    @ResponseStatus(HttpStatus.OK)
    public long  countItemInstancesByItemIdAndIntendedDates(@PathVariable Long id) {
        return  itemInstanceService.countItemInstancesByItemIdAndIntendedDates(id,new Date(123),new Date(1123));
    }


}
