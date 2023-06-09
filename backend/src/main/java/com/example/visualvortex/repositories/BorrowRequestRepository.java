package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Request.BorrowRequest;
import com.example.visualvortex.entities.Request.RequestStatus;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, UUID> {


    Optional<BorrowRequest> findById(@NonNull UUID requestId);

    List<BorrowRequest> findByUserId(Long userId);

    BorrowRequest findByRequestId(UUID requestId);


    @Query("SELECT br FROM BorrowRequest br WHERE :itemId MEMBER OF br.itemIds AND br.status =:status")
    List<BorrowRequest> findRequestsByItemIdAndStatus(@Param("itemId") Long itemId, @Param("status") RequestStatus status);

}
