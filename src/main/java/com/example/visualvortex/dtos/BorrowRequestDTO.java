package com.example.visualvortex.dtos;


import lombok.*;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class BorrowRequestDTO {
    private LocalDateTime intendedStartDate;
    private LocalDateTime intendedReturnDate;
    private LocalDateTime sentRequestTime;
    private String borrowingReason;
    private Integer quantity;
    private Long userId;
    private Long itemId;
    private String signatureData;
}
