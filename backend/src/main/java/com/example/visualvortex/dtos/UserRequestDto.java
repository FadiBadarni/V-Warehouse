package com.example.visualvortex.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserRequestDto {
    private String recipient;
    private String role;
    private int year;
}