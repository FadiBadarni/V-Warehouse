package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.ItemAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemAttributeRepository extends JpaRepository<ItemAttribute, Long> {
}
