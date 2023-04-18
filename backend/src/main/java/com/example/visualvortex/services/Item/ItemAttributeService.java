package com.example.visualvortex.services.Item;

import com.example.visualvortex.entities.Item.ItemAttribute;
import com.example.visualvortex.repositories.ItemAttributeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemAttributeService {

    @Autowired
    private ItemAttributeRepository repository;

    public ItemAttribute save(ItemAttribute itemAttribute) {
        return repository.save(itemAttribute);
    }

    public List<ItemAttribute> findAll() {
        return repository.findAll();
    }

    public Optional<ItemAttribute> findById(Long id) {
        return repository.findById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }


}
