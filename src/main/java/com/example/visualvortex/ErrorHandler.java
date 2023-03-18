package com.example.visualvortex;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class ErrorHandler {

    /**
     * All errors thrown are handled here
     * The exception message will be displayed on /error page, which can be customized
     * @param exception
     * @return
     */

    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception exception) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error");
        modelAndView.addObject("errorMessage", "An error occured: " + exception.getMessage());
        return modelAndView;
    }
}
