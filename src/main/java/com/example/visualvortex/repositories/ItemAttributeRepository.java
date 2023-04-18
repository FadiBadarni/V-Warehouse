package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Item.ItemAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemAttributeRepository extends JpaRepository<ItemAttribute, Long> {
}
