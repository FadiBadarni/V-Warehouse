package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Item.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByName(String name);

    Optional<Item> findByNameAndItemTypeId(String name, long itemTypeId);
}
