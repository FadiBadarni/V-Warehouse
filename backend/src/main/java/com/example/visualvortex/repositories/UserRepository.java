package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.User.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByEmail(String email);
    User findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.idNumber = :idNumber")
    User findByIdNumber(@Param("idNumber") String idNumber);


//    @Query("DELETE FROM User u WHERE u.id = :id")
//    String deleteByID(@Param("id") long id);
}
