package com.example.visualvortex.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Collection;

public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        request.getSession().setAttribute("roles", authorities);

        redirectStrategy.sendRedirect(request, response, isAdminUser(authentication) ? "/admin" : "/home");
    }

    private boolean isAdminUser(Authentication authentication) {
        return authentication.getAuthorities().stream().map(auth -> auth.getAuthority()).toList().contains("ADMIN");
    }
}