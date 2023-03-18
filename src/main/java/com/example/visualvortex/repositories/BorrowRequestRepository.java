package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
}
