package com.example.visualvortex.controllers.AdminControllers;


import com.example.visualvortex.dtos.InventoryItemDTO;
import com.example.visualvortex.services.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AddItemController {

    @Autowired
    private InventoryItemService inventoryItemService;

    @PostMapping("/add-item")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addItem(@RequestBody InventoryItemDTO inventoryItemDTO) {
        inventoryItemService.saveInventoryItem(inventoryItemDTO);
        return ResponseEntity.ok("Created Item.");
    }
}
