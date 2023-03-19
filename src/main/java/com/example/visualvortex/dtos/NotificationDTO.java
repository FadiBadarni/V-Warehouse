package com.example.visualvortex.dtos;


import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class NotificationDTO {
    private long id;
    private String message;
    private LocalDateTime date;
    private Long userId;
    private boolean isRead;

}
