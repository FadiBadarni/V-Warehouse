package com.example.visualvortex.services.User;

import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerUserdetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isEmpty()) {
            throw new UsernameNotFoundException(email);
        }
        User user = userByEmail.get();
        return org.springframework.security.core.userdetails.User.withUsername(email)
                .password(user.getPassword())
                .authorities(user.getRole().name()).build();
    }
}
