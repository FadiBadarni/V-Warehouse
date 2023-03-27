package com.example.visualvortex.entities;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.w3c.dom.Text;

import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_requests") // users is already used by postgresql
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class BorrowRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long userId;
    private Long itemId;

    @Column(nullable = false, columnDefinition = "timestamp without time zone default NOW()::timestamp(0)")
    private LocalDateTime intendedStartDate, intendedReturnDate;

    @Column(nullable = false)
    private String borrowingReason;
    @Column(nullable = true, columnDefinition = "bytea")
    private byte[] signatureData;
    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, columnDefinition = "timestamp without time zone default NOW()")
    private LocalDateTime sentRequestTime;

}
