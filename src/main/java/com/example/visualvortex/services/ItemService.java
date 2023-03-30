package com.example.visualvortex.services;


import com.example.visualvortex.dtos.ItemAttributeDTO;
import com.example.visualvortex.dtos.ItemDTO;
import com.example.visualvortex.entities.Item;
import com.example.visualvortex.entities.ItemAttribute;
import com.example.visualvortex.entities.ItemTypeAttribute;
import com.example.visualvortex.repositories.ItemAttributeRepository;
import com.example.visualvortex.repositories.ItemRepository;
import com.example.visualvortex.repositories.ItemTypeAttributeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ItemTypeAttributeRepository itemTypeAttributeRepository;
    @Autowired
    private ItemAttributeRepository itemAttributeRepository;
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }


    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Inventory item not found with ID: " + id));
    }

    public void saveItem(ItemDTO itemDTO) {
        ItemTypeAttribute itemType;

        // Look for existing item type by name
        Optional<ItemTypeAttribute> existingItemType = itemTypeAttributeRepository.findByName(itemDTO.getItemType().getName());

        // If item type exists, use it; otherwise, create a new one
        if (existingItemType.isPresent()) {
            itemType = existingItemType.get();
        } else {
            itemType = new ItemTypeAttribute();
            itemType.setName(itemDTO.getItemType().getName());
            itemType = itemTypeAttributeRepository.save(itemType);
        }

        // Create a list of ItemAttribute objects
        List<ItemAttribute> itemAttributes = new ArrayList<>();
        for (ItemAttributeDTO itemAttributeDTO : itemDTO.getItemType().getAttributes()) {
            ItemAttribute itemAttribute = new ItemAttribute();
            itemAttribute.setAttributeName(itemAttributeDTO.getAttributeName());
            itemAttribute.setAttributeValue(itemAttributeDTO.getAttributeValue());
            itemAttribute.setItemType(itemType);
            itemAttributes.add(itemAttribute);
        }

        // Create items according to the quantity input
        for (int i = 0; i < itemDTO.getQuantity(); i++) {
            Item item = new Item();
            item.setDescription(itemDTO.getDescription());
            item.setName(itemDTO.getName());
            item.setItemType(itemType);

            item = itemRepository.save(item); // Save the item and get the updated instance with its ID

            // Save item attributes
            for (ItemAttribute itemAttribute : itemAttributes) {
                ItemAttribute newItemAttribute = new ItemAttribute(itemAttribute.getAttributeName(),
                        itemAttribute.getAttributeValue(), itemAttribute.getItemType(), item);
                itemAttributeRepository.save(newItemAttribute);
            }
        }
    }





}
