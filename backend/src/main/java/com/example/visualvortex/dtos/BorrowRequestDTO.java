package com.example.visualvortex.dtos;


import com.example.visualvortex.entities.Request.RequestStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime intendedStartDate;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime intendedReturnDate;
    private LocalDateTime requestTime;
    private String borrowingReason;
    private int quantity;
    private Long userId;
    private Long itemId;
    private String signatureData;
    private RequestStatus status;
    private UUID requestId;
    private  List<Long> instancesIds;
}
