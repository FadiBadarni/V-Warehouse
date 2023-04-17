package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Item.ItemInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemInstanceRepository extends JpaRepository<ItemInstance, Long> {
    @Query("SELECT COUNT(*) FROM ItemInstance WHERE item.id = ?1")
    int quantityItemsBy(Long id);
    List<ItemInstance> findAllByItemId(Long itemId);

}
