package com.example.visualvortex.services.Item;


import com.example.visualvortex.dtos.ItemDTOS.*;
import com.example.visualvortex.entities.Item.*;
import com.example.visualvortex.repositories.ItemAttributeRepository;
import com.example.visualvortex.repositories.ItemInstanceRepository;
import com.example.visualvortex.repositories.ItemRepository;
import com.example.visualvortex.repositories.ItemTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemAttributeRepository itemAttributeRepository;
    private final ItemInstanceRepository itemInstanceRepository;
    private final ItemAttributeService itemAttributeService;
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }


    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found with ID: " + id));
    }

    public List<Item> getItemsByIds(List<Long> ids) {
        return itemRepository.findAllById(ids);
    }

    private void saveImageToFile(String dataUrl, String fileName) {
        // Extract the image data from the data URL
        String[] parts = dataUrl.split(",");
        String base64Data = parts[1];
        byte[] imageData = Base64.getDecoder().decode(base64Data);

        String str = fileName.replace(' ', '_').toLowerCase() + ".png";
        // Generate a unique filename
        // Save the image to disk
        String filePath = "frontend\\src\\assets\\items\\" + str;
        try (OutputStream stream = new FileOutputStream(filePath)) {
            stream.write(imageData);
        } catch (IOException e) {
//            System.out.println(e);
        }

    }

    public void saveItem(InstanceDTO instanceDTO) {
        try {
            saveImageToFile(instanceDTO.getImg(), instanceDTO.getName());
        }catch (Exception e)
        {
            System.out.println("dont save img");
        }

        ItemType itemType;
        // Look for existing item type by name
        Optional<ItemType> existingItemType = itemTypeRepository.findByName(instanceDTO.getItemType().getName());

        // If item type exists, use it; otherwise, create a new one
        if (existingItemType.isPresent()) {
            itemType = existingItemType.get();
        } else {
            itemType = new ItemType();
            itemType.setName(instanceDTO.getItemType().getName());
            itemType = itemTypeRepository.save(itemType);

            // Save the item attributes
            Set<ItemAttribute> itemAttributes = new HashSet<>();
            for (ItemAttributeDTO attributeDTO : instanceDTO.getItemType().getAttributes()) {
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
        Optional<Item> existingItem = itemRepository.findByNameAndItemTypeId(instanceDTO.getName(), itemType.getId());

        // If the item exists, use it; otherwise, create a new item
        Item item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            item.setDescription(instanceDTO.getDescription());
            item.setName(instanceDTO.getName());
            item.setItemType(itemType);
            item.setForBorrow(instanceDTO.isForBorrow());
            item = itemRepository.save(item);
        } else {
            item = new Item();
            item.setDescription(instanceDTO.getDescription());
            item.setName(instanceDTO.getName());
            item.setItemType(itemType);
            item.setForBorrow(instanceDTO.isForBorrow());
            item = itemRepository.save(item);
        }

        // Create the item instances
//        List<ItemInstance> itemInstances = new ArrayList<>();
//
//        for (int i = 0; i < itemDTO.getQuantity(); i++) {
//            ItemInstance itemInstance = new ItemInstance();
//            itemInstance.setItem(item);
//            itemInstance.setState(ItemState.AVAILABLE);
//            itemInstances.add(itemInstance);
//        }
        if(instanceDTO.getSerialNumber()!=null) {
            ItemInstance itemInstance = new ItemInstance();
            itemInstance.setItem(item);
            itemInstance.setState(ItemState.AVAILABLE);
//          long x=Long.parseLong();
            itemInstance.setId(instanceDTO.getSerialNumber());


            // Save the item instances
            itemInstanceRepository.save(itemInstance);
//        ItemInstance savedItemInstances = itemInstanceRepository.save(itemInstance);

            // Update the item with the new instances
            item.getItemInstances().add(itemInstance);
        }
        itemRepository.save(item);

//        return savedItemInstances.stream()
//                .map(instance -> new ItemInstanceDTO(
//                        instance.getId(),
//                        instance.getState(),
//                        instance.getItem().getId()))
//                .collect(Collectors.toList());
    }


    public List<String> getItemNames() {
        return itemRepository.findAll().stream()
                .map(Item::getName)
                .distinct()
                .collect(Collectors.toList());
    }

    public itemDTO getItemByName(String name) {
        Item item = itemRepository.findByName(name)
                .orElseThrow(() -> new NoSuchElementException("Inventory item not found with name: " + name));

        return itemToItemDTO(item);
    }

    public itemDTO itemToItemDTO(Item item) {
        ItemType itemType = item.getItemType();


        Set<ItemAttributeDTO> itemTypeAttributeDTOs = itemAttributeService.findByItemTypeId(itemType.getId()).stream()
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
                .filter(dto -> dto.getState() == ItemState.AVAILABLE)
                .map(instance -> new ItemInstanceDTO(
                        instance.getId(),
                        instance.getState(),
                        instance.getItem().getId()))
                .toList();

        return itemDTO.builder()
                .id(item.getId())
                .forBorrow(item.isForBorrow())
                .name(item.getName())
                .description(item.getDescription())
                .quantity(item.getItemInstances().size())
                .itemType(itemTypeDTO)
                .itemInstances(itemInstanceDTOs)
                .build();
    }


    public List<ItemInstance> getAllInstanceById(Long id) {
        return itemInstanceRepository.findAllByItemId(id);
    }


}