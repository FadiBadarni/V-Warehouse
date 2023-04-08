package com.example.visualvortex.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    private Long id;
    private Long itemInstanceId;
    private LocalDateTime intendedStartDate;
    private LocalDateTime intendedReturnDate;
    private Long userId;
    private Long itemTypeId;
    private boolean isActive;
}
