package com.example.visualvortex.services;

import com.example.visualvortex.entities.User;
import com.example.visualvortex.entities.UserRole;
import com.example.visualvortex.errors.FileParsingException;
import com.example.visualvortex.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    private UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
        this.passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }


    public UserService() {
        this.passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    public boolean authenticateUser(String username, String password) {
        User user = repository.findByUsername(username);
        if (user != null) {
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    public User findUserByUsername(String username) {
        return repository.findByUsername(username);
    }

    public Optional<User> findUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    private String encodePassword(String password) {
        PasswordEncoder delegatingPasswordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        return delegatingPasswordEncoder.encode(password);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByUsername(username);
        if (user == null){
            throw new UsernameNotFoundException("Didnt find user with username : " + username);
        }
        return user;
 }

    public void registerUser(String email, String username, int year, String password) {
        Optional<User> user = repository.findByEmail(email);
        if (user.isPresent()) {
            System.err.println("User already exists: " + email);
            return;
        }

        try {
            User newUser = User.
                    builder().
                    email(email).
                    username(username).
                    year(year).
                    password(encodePassword(password)).
                    role(UserRole.USER).
                    build();

            repository.save(newUser);

            LOGGER.info("Registered user: {}", email);
        } catch (Exception e) {
            LOGGER.error("Error registering user: {}", email, e);
            e.printStackTrace();
        }
    }

    public void importUsers(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            LOGGER.info("Total rows in the sheet: {}", sheet.getPhysicalNumberOfRows());
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    System.err.println("Row " + i + " is empty");
                    continue;
                }
                Cell emailCell = row.getCell(0);
                Cell usernameCell = row.getCell(1);
                Cell yearCell = row.getCell(2);
                Cell passwordCell = row.getCell(3);
                if (emailCell != null && passwordCell != null && usernameCell != null && yearCell != null) {
                    String email = emailCell.getStringCellValue();
                    String username = usernameCell.getStringCellValue();
                    int year = Integer.parseInt(String.valueOf((int) yearCell.getNumericCellValue()));
                    String password = "";
                    if (passwordCell.getCellType() == CellType.NUMERIC) {
                        password = Integer.toString((int) passwordCell.getNumericCellValue());
                    } else if (passwordCell.getCellType() == CellType.STRING) {
                        password = passwordCell.getStringCellValue();
                    }
                    registerUser(email, username, year, password);
                } else {
                    System.err.println("Row " + i + " has missing data");
                }
            }
        } catch (IOException e) {
            throw new FileParsingException("Failed to parse Excel file", e);
        }
    }

}
