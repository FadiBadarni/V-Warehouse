package com.example.visualvortex.controllers.AdminControllers;

import com.example.visualvortex.dtos.ItemDTOS.ItemDTO;
import com.example.visualvortex.dtos.ItemDTOS.ItemInstanceDTO;
import com.example.visualvortex.entities.User.User;
import com.example.visualvortex.services.Item.ItemInstanceService;
import com.example.visualvortex.services.Item.ItemService;
import com.example.visualvortex.services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class ItemManagementController {

    private final ItemService itemService;
    private final ItemInstanceService itemInstanceService;
    private final UserService userService;

    @PostMapping("/add-item")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemInstanceDTO> addItem(@RequestBody ItemDTO itemDTO) {
        return itemService.saveItem(itemDTO);
    }

    @GetMapping("/item-names")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getItemNames() {
        return itemService.getItemNames();
    }

    @GetMapping("/item-by-name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public ItemDTO getItemByName(@PathVariable String name) {
        return itemService.getItemByName(name);
    }

    @GetMapping("/all-item-instances")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemInstanceDTO> getAllItemInstances() {
        return itemInstanceService.getAllItemInstances();
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Iterable<User> getAllUsers() {
        return  userService.findAll();
    }

}
