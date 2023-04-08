package com.example.visualvortex.services.Item;


import com.example.visualvortex.dtos.ItemDTOS.ItemAttributeDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.entities.Item.*;
import com.example.visualvortex.dtos.ItemDTOS.ItemTypeDTO;
import com.example.visualvortex.repositories.ItemAttributeRepository;
import com.example.visualvortex.repositories.ItemInstanceRepository;
import com.example.visualvortex.repositories.ItemRepository;
import com.example.visualvortex.repositories.ItemTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemAttributeRepository itemAttributeRepository;
    private final ItemInstanceRepository itemInstanceRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }


    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found with ID: " + id));
    }

    public List<ItemInstanceDTO> saveItem(ItemDTO itemDTO) {
        ItemType itemType;

        // Look for existing item type by name
        Optional<ItemType> existingItemType = itemTypeRepository.findByName(itemDTO.getItemType().getName());

        // If item type exists, use it; otherwise, create a new one
        if (existingItemType.isPresent()) {
            itemType = existingItemType.get();
        } else {
            itemType = new ItemType();
            itemType.setName(itemDTO.getItemType().getName());
            itemType = itemTypeRepository.save(itemType);

            // Save the item attributes
            Set<ItemAttribute> itemAttributes = new HashSet<>();
            for (ItemAttributeDTO attributeDTO : itemDTO.getItemType().getAttributes()) {
                ItemAttribute itemAttribute = new ItemAttribute(
                        attributeDTO.getAttributeName(),
                        attributeDTO.getAttributeValue(),
                        itemType
                );
                itemAttributeRepository.save(itemAttribute);
                itemAttributes.add(itemAttribute);
            }

            // Set item attributes to the itemType
            itemType.setAttributes(itemAttributes);
        }

        // Check if the item already exists in the inventory
        Optional<Item> existingItem = itemRepository.findByNameAndItemTypeId(itemDTO.getName(), itemType.getId());

        // If the item exists, use it; otherwise, create a new item
        Item item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
        } else {
            item = new Item();
            item.setDescription(itemDTO.getDescription());
            item.setName(itemDTO.getName());
            item.setItemType(itemType);
            item = itemRepository.save(item);
        }

        // Create the item instances
        List<ItemInstance> itemInstances = new ArrayList<>();
        for (int i = 0; i < itemDTO.getQuantity(); i++) {
            ItemInstance itemInstance = new ItemInstance();
            itemInstance.setItem(item);
            itemInstance.setState(ItemState.AVAILABLE);
            itemInstances.add(itemInstance);
        }

        // Save the item instances
        itemInstanceRepository.saveAll(itemInstances);
        List<ItemInstance> savedItemInstances = itemInstanceRepository.saveAll(itemInstances);

        // Update the item with the new instances
        item.getItemInstances().addAll(itemInstances);
        itemRepository.save(item);

        return savedItemInstances.stream()
                .map(instance -> new ItemInstanceDTO(
                        instance.getId(),
                        instance.getState(),
                        instance.getItem().getId()))
                .collect(Collectors.toList());
    }


    public List<String> getItemNames() {
        return itemRepository.findAll().stream()
                .map(Item::getName)
                .distinct()
                .collect(Collectors.toList());
    }

    public ItemDTO getItemByName(String name) {
        Item item = itemRepository.findByName(name)
                .orElseThrow(() -> new NoSuchElementException("Inventory item not found with name: " + name));

        return itemToItemDTO(item);
    }

    public ItemDTO itemToItemDTO(Item item) {
        ItemType itemType = item.getItemType();
        Set<ItemAttributeDTO> itemTypeAttributeDTOs = itemType.getAttributes().stream()
                .map(attribute -> new ItemAttributeDTO(
                        attribute.getId(),
                        attribute.getAttributeName(),
                        attribute.getAttributeValue()))
                .collect(Collectors.toSet());

        ItemTypeDTO itemTypeDTO = new ItemTypeDTO(
                itemType.getId(),
                itemType.getName(),
                itemTypeAttributeDTOs
        );

        List<ItemInstanceDTO> itemInstanceDTOs = item.getItemInstances().stream()
                .map(instance -> new ItemInstanceDTO(
                        instance.getId(),
                        instance.getState(),
                        instance.getItem().getId()))
                .toList();

        return ItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .quantity(item.getItemInstances().size())
                .itemType(itemTypeDTO)
                .itemInstances(itemInstanceDTOs)
                .build();
    }




}
