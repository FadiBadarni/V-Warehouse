package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.RequestStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

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
    private RequestStatus status;
    private UUID requestId;
}
