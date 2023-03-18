package com.example.visualvortex.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_info")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Getter
@Setter
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private Integer age;
    private String picture;

    @OneToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private User user;
}
