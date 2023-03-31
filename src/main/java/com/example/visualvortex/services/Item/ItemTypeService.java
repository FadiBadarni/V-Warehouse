package com.example.visualvortex.services.Item;

import com.example.visualvortex.entities.Item.ItemType;
import com.example.visualvortex.repositories.ItemTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemTypeService {

    @Autowired
    private ItemTypeRepository repository;

    public ItemType save(ItemType itemType) {
        return repository.save(itemType);
    }

    public List<ItemType> findAll() {
        return repository.findAll();
    }

    public Optional<ItemType> findById(Long id) {
        return repository.findById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
