package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Item.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Long> {
    Optional<ItemType> findByName(String name);

    @Query("SELECT name FROM ItemType")
    List<String> getAllTypes();
}
