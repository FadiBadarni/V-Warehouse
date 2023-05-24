package com.example.visualvortex.services.User;

import com.example.visualvortex.dtos.UserDTOS.UserDTO;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.entities.User.UserRole;
import com.example.visualvortex.errors.FileParsingException;
import com.example.visualvortex.errors.ResourceNotFoundException;
import com.example.visualvortex.repositories.UserRepository;
import com.example.visualvortex.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    @Autowired
    private EmailService emailService;

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    private final UserRepository repository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return Optional.ofNullable(repository.findByUsername(username))
                .orElseThrow(() -> new UsernameNotFoundException("Did not find user with username: " + username));
    }

    public Optional<UserDetails> authenticateUser(String username, String password) {
        UserDetails userDetails = loadUserByUsername(username);
        return passwordEncoder.matches(password, userDetails.getPassword()) ? Optional.of(userDetails) : Optional.empty();
    }

    public String generateToken(UserDetails userDetails) {
        return jwtUtil.generateToken(userDetails);
    }
    public Map<String, Object> createResponse(String token, UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userInfo", userDTO);
        return response;
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

    public User getUserById(Long id) {
        return repository.findById(id).orElse(null);
    }
    public UserDTO createUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .year(user.getYear())
                .role(user.getRole())
                .build();
    }

    public void registerUser(String email, String username, int year, String password) {
        Optional<User> user = repository.findByEmail(email);
        if (user.isPresent()) {
            LOGGER.error("User already exists: {}", email);
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
                if (row != null) {
                    processRow(row);
                } else {
                    LOGGER.error("Row {} is empty", i);
                }

            }
        } catch (IOException e) {
            throw new FileParsingException("Failed to parse Excel file", e);
        }
    }

    private void processRow(Row row) {
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
            LOGGER.error("Missing data in row {}", row.getRowNum());
        }
    }

    public Iterable<User> findAll() {
        return repository.findAll();
    }

    public void updateRoleInUserId(Long id,String Role) {
        User user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(UserRole.valueOf(Role));
        repository.save(user);
    }




    private String createPassword(){
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        int length = 7;
        for(int i = 0; i < length; i++) {
            int index = random.nextInt(alphabet.length());
            char randomChar = alphabet.charAt(index);
            sb.append(randomChar);
        }
        String randomString = sb.toString();
        return randomString;
    }

    public void createUser(String recipient, String role, int year) {

        String body="your Username is:";
        User user=null;
        String username=recipient.split("@")[0];
        if(repository.findByEmail(recipient).isPresent())
        {
            return;
        }
        user=repository.findByUsername(username);
        int i=0;
        while (user!=null)
        {
            i++;
            user=repository.findByUsername(username+i);
        }
        if(i!=0)
         username=username+i;

      String  password =createPassword();
        body=body+username+"\n your password is:"+password;
         try {
             emailService.sendEmail(recipient,"You have new Account",body);
         }catch (Exception e) {}

         User newUser= User.builder().email(recipient).role(UserRole.valueOf(role))
                 .password(encodePassword(password)).year(year).username(username).build();
         repository.save(newUser);


    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void updateUser(Long id, String email, String username, String role, Integer year) {
        User user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEmail(email);
        user.setUsername(username);
        user.setRole(UserRole.valueOf(role));
        user.setYear(year);
        repository.save(user);
    }

    public Optional<User> findById(Long userId) {
        return repository.findById(userId);
    }

    public List<User> getAllAdmin() {
        Iterable<User> allUsers = repository.findAll();
        List<User> adminUsers = new ArrayList<>();

        for (User user : allUsers) {
            if (user.getRole() == UserRole.ADMIN) {
                adminUsers.add(user);
            }
        }

        return adminUsers;
    }
}
