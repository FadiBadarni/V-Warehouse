package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.User.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByEmail(String email);
    User findByUsername(String username);

//    @Query("DELETE FROM User u WHERE u.id = :id")
//    String deleteByID(@Param("id") long id);
}
