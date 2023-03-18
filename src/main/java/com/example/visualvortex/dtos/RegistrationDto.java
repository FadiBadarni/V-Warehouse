package com.example.visualvortex.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDto {

    @NotEmpty(message = "email is required")
    private String email;

    @NotEmpty
    private String password;

    @NotEmpty
    private String confirmPassword;

}
