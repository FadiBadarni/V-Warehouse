package com.example.visualvortex.services.Item;


import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.repositories.ItemInstanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemInstanceService {

    private final ItemInstanceRepository itemInstanceRepository;

    public List<ItemInstanceDTO> getAllItemInstances() {
        List<ItemInstance> itemInstances = itemInstanceRepository.findAll();

        return itemInstances.stream()
                .map(instance -> new ItemInstanceDTO(
                        instance.getId(),
                        instance.getState(),
                        instance.getItem().getId()))
                .collect(Collectors.toList());
    }

    public int quantityItemsBy(Long id) {
        return itemInstanceRepository.quantityItemsBy(id);

    }
}
