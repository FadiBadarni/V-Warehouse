package com.example.visualvortex.services.Item;

import com.example.visualvortex.entities.Item.ItemType;
import com.example.visualvortex.repositories.ItemTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemTypeService {
    private final ItemTypeRepository repository;


    public ItemType save(ItemType itemType) {
        return repository.save(itemType);
    }
    public List<ItemType> findAll() {
        return repository.findAll();
    }

    public Optional<ItemType> findById(Long id) {
        return repository.findById(id);
    }

    public List<String> listType(){
      return repository.getAllTypes();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
