package com.example.visualvortex.services;

import com.example.visualvortex.entities.User;
import com.example.visualvortex.entities.UserRole;
import com.example.visualvortex.errors.UserAlreadyExists;
import com.example.visualvortex.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repository;
    private final PasswordEncoder passwordEncoder;



    public UserService() {
        this.passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    public boolean authenticateUser(String email, String password) {
        Optional<User> user = repository.findByEmail(email);
        return user.filter(value -> passwordEncoder.matches(password, value.getPassword())).isPresent();

    }

    public void registerUser(String email, String password) {
        Optional<User> user = repository.findByEmail(email);
        if (user.isPresent()) {
            throw new UserAlreadyExists();
        }

        User newUser = User.builder().email(email).password(encodePassword(password)).role(UserRole.USER).build();
        repository.save(newUser);
    }

    public Optional<User> findUserByEmail(String email) {
        return repository.findByEmail(email);
    }


    private String encodePassword(String password) {
        PasswordEncoder delegatingPasswordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        return delegatingPasswordEncoder.encode(password);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<com.example.visualvortex.entities.User> optionalUser = findUserByEmail(email);
        return optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
