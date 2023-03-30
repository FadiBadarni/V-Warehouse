package com.example.visualvortex.controllers.AdminControllers;


import com.example.visualvortex.dtos.ItemDTO;
import com.example.visualvortex.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AddItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping("/add-item")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addItem(@RequestBody ItemDTO itemDTO) {
        itemService.saveItem(itemDTO);
        return ResponseEntity.ok("Created Item.");
    }

}
