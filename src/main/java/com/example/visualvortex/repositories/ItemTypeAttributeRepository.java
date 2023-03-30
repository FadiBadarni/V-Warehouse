package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.ItemTypeAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemTypeAttributeRepository extends JpaRepository<ItemTypeAttribute, Long> {
    Optional<ItemTypeAttribute> findByName(String name);
}
