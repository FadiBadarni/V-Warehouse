package com.example.visualvortex;

import com.example.visualvortex.entities.User;
import com.example.visualvortex.entities.UserRole;
import com.example.visualvortex.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;

@SpringBootApplication
public class DemoApplication {


	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	public CommandLineRunner runner(UserRepository userRepository) {
		String encodedPassword = PasswordEncoderFactories.createDelegatingPasswordEncoder().encode("helloworld");
		return (args) -> {
			userRepository.save(User.builder().email("admin@example.com").password(encodedPassword).role(UserRole.ADMIN).build());
			userRepository.save(User.builder().email("test@example.com").password(encodedPassword).role(UserRole.USER).build());
		};
	}

}
