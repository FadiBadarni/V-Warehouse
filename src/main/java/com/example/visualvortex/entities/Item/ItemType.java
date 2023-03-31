package com.example.visualvortex.entities.Item;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;


@Entity
@Table(name = "item_types")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;


    @OneToMany(mappedBy = "itemType")
    private Set<ItemAttribute> attributes;


}
