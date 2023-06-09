package com.example.visualvortex.entities.Request;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "borrow_requests")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class BorrowRequest {

    @Id
    @Column(nullable = false, columnDefinition = "uuid default gen_random_uuid()")
    private UUID requestId;

    private Long userId;


    @CollectionTable(name = "request_item_ids", joinColumns = @JoinColumn(name = "request_id"))
    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "item_id")
    private List<Long> itemIds;

    @Column(nullable = false, columnDefinition = "timestamp without time zone default NOW()::timestamp(0)")
    private LocalDateTime intendedStartDate, intendedReturnDate;

    @Column(nullable = false)
    private String borrowingReason;

    @Column
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "requests_instances")
    private List<Long> itemInstanceIds;

    private String signatureData;

    @Column(nullable = false, columnDefinition = "timestamp without time zone default NOW()")
    private LocalDateTime requestTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

}
