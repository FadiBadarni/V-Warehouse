package com.example.visualvortex.controllers;

import com.example.visualvortex.controllers.NotificationsController.NotificationsController;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = NotificationsController.class)
public class NotificationsControllerTest {

}