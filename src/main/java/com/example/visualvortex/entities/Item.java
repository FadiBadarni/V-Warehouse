package com.example.visualvortex.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "items")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private String description;
    private boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "item_type_id")
    private ItemTypeAttribute itemType;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private Set<ItemAttribute> attributes;
}
