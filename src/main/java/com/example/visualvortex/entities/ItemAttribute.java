package com.example.visualvortex.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item_attributes")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ItemAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String attributeName;
    private String attributeValue;

    @ManyToOne
    @JoinColumn(name = "item_type_id")
    private ItemTypeAttribute itemType;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    public ItemAttribute(String attributeName, String attributeValue, ItemTypeAttribute itemType, Item item) {
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
        this.itemType = itemType;
        this.item = item;
    }
}
