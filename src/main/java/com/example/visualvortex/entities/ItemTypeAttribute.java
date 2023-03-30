package com.example.visualvortex.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Entity
@Table(name = "item_types")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ItemTypeAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;

    @OneToMany(mappedBy = "itemType")
    private Set<ItemAttribute> attributes;
}
