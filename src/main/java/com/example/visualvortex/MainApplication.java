package com.example.visualvortex;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Objects;

@SpringBootApplication
public class MainApplication {



	public static void main(String[] args) throws IOException {



		ClassLoader classLoader=SpringApplication.class.getClassLoader();
//		File file=new File(Objects.requireNonNull(classLoader.getResource("serviceAccountKey.json")).getFile());
		FileInputStream serviceAccount=new FileInputStream("C:\\Users\\abada\\OneDrive\\שולחן העבודה\\update\\SB-Backend\\src\\main\\resources\\serviceAccountKey.json");



		FirebaseOptions options = new FirebaseOptions.Builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.build();

		FirebaseApp.initializeApp(options);

		SpringApplication.run(MainApplication.class, args);
	}

}
