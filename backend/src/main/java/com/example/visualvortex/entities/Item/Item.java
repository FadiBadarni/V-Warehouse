package com.example.visualvortex.entities.Item;



import lombok.*;

import javax.persistence.*;
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

    @ManyToOne
    @JoinColumn(name = "item_type_id")
    private ItemType itemType;

    @OneToMany(mappedBy = "item", fetch = FetchType.EAGER)
    private List<ItemInstance> itemInstances;


}
