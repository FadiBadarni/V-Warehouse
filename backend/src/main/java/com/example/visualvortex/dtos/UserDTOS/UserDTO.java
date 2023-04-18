package com.example.visualvortex.dtos.UserDTOS;

import com.example.visualvortex.entities.User.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private Integer year;
    private UserRole role;

}
