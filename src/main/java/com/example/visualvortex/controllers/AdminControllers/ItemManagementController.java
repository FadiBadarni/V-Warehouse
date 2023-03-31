package com.example.visualvortex.controllers.AdminControllers;


import com.example.visualvortex.dtos.ItemDTOS.ItemAttributeDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.entities.Item.Item;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.services.Item.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
public class ItemManagementController {

    @Autowired
    private ItemService itemService;

    @PostMapping("/add-item")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ItemInstanceDTO>> addItem(@RequestBody ItemDTO itemDTO) {
        List<ItemInstanceDTO> createdInstances = itemService.saveItem(itemDTO);
        return ResponseEntity.ok(createdInstances);
    }


    @GetMapping("/item-names")
    public ResponseEntity<List<String>> getItemNames() {
        List<String> itemNames = itemService.getItemNames();
        return new ResponseEntity<>(itemNames, HttpStatus.OK);
    }

    @GetMapping("/item-by-name/{name}")
    public ResponseEntity<ItemDTO> getItemByName(@PathVariable String name) {
        ItemDTO item = itemService.getItemByName(name);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

//    @GetMapping("/item-instance-by-name/{name}")
//    public ResponseEntity<ItemInstanceDTO> getItemInstanceByName(@PathVariable String name) {
//        ItemInstance itemInstance = itemService.getAvailableItemInstance(name);
//        ItemInstanceDTO itemInstanceDTO = new ItemInstanceDTO(itemInstance.getId(), itemInstance.getState());
//        return new ResponseEntity<>(itemInstanceDTO, HttpStatus.OK);
//    }

    @GetMapping("/all-item-instances")
    public ResponseEntity<List<ItemInstanceDTO>> getAllItemInstances() {
        List<ItemInstanceDTO> itemInstances = itemService.getAllItemInstances();
        return new ResponseEntity<>(itemInstances, HttpStatus.OK);
    }

}
