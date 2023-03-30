package com.example.visualvortex.services;

import com.example.visualvortex.entities.ItemTypeAttribute;
import com.example.visualvortex.repositories.ItemTypeAttributeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemTypeAttributeService {

    @Autowired
    private ItemTypeAttributeRepository repository;

    public ItemTypeAttribute save(ItemTypeAttribute itemTypeAttribute) {
        return repository.save(itemTypeAttribute);
    }

    public List<ItemTypeAttribute> findAll() {
        return repository.findAll();
    }

    public Optional<ItemTypeAttribute> findById(Long id) {
        return repository.findById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
