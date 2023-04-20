package com.example.visualvortex.controllers.UserControllers;


import com.example.visualvortex.dtos.BorrowRequestDTO;
import com.example.visualvortex.services.BorrowRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserRequestsController {

    private final BorrowRequestService borrowRequestService;

    @GetMapping("/borrow-requests/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<BorrowRequestDTO> getRequestsByUserId(@PathVariable Long userId) {
        return borrowRequestService.getRequestsByUserId(userId);
    }

}
