package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.Request.RequestStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
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
    private LocalDateTime requestTime;
    private String borrowingReason;
    private List<Long> itemInstanceIds;
    private Long userId;
    private Long itemId;
    private String signatureData;
    private RequestStatus status;
    private UUID requestId;
}
