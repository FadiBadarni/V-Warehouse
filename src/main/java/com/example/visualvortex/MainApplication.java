package com.example.visualvortex;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) throws IOException {
		initFirebase();
		SpringApplication.run(MainApplication.class, args);
	}

	private static void initFirebase() throws IOException {
		InputStream serviceAccount = new ClassPathResource("AccountKey.json").getInputStream();
		FirebaseOptions options = FirebaseOptions.builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.build();
		FirebaseApp.initializeApp(options);
	}

}