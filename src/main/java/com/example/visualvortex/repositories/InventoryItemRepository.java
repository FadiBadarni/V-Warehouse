package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
}
