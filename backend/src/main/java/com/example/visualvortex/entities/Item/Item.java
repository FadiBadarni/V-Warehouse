package com.example.visualvortex.entities.Item;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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
    @Column(nullable = true)
    private boolean takeOut;

    @ManyToOne
    @JoinColumn(name = "item_type_id")
    private ItemType itemType;

    @OneToMany(mappedBy = "item", fetch = FetchType.EAGER)
    private List<ItemInstance> itemInstances = new ArrayList<>();;

}
