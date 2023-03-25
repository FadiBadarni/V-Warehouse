package com.example.visualvortex.dtos;

import com.example.visualvortex.entities.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private Integer year;
    private UserRole role;

}
