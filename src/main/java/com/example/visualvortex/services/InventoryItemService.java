package com.example.visualvortex.services;


import com.example.visualvortex.entities.InventoryItem;
import com.example.visualvortex.repositories.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class InventoryItemService {
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    public List<InventoryItem> getAllInventoryItems() {
        return inventoryItemRepository.findAll();
    }


    public InventoryItem getInventoryItemById(Long id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Inventory item not found with ID: " + id));
    }
}
