package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserProfileDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private String picture;
    private UserRole role;

}