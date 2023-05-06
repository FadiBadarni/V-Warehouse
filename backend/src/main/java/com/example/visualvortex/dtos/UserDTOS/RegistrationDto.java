package com.example.visualvortex.dtos.UserDTOS;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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
    private String username;
    @NotNull
    private int year;
    @NotEmpty
    private String password;

    @NotEmpty
    private String confirmPassword;

}
