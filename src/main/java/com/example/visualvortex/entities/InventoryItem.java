package com.example.visualvortex.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory_items") // users is already used by postgresql
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private String description;
    private int quantity;
    private String type;
    private String safetyInstructions;
    private String accompanyingEquipment;

}
