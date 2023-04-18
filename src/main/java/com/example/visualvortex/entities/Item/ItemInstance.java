package com.example.visualvortex.entities.Item;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "item_instances")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Enumerated(EnumType.STRING)
    private ItemState state;

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonIgnore
    private Item item;

    @Override
    public String toString() {
        return id+" ";
    }
}
