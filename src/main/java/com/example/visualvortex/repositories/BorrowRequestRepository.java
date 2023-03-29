package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.BorrowRequest;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, UUID> {


    Optional<BorrowRequest> findById(@NonNull UUID requestId);
}
