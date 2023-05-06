package com.example.visualvortex.entities.Item;

import lombok.*;
import javax.persistence.*;
@Entity
@Table(name = "item_attributes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String attributeName;
    private String attributeValue;

    @ManyToOne
    @JoinColumn(name = "item_type_id")
    private ItemType itemType;

    public ItemAttribute(String attributeName, String attributeValue, ItemType itemType) {
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
        this.itemType = itemType;
    }
}