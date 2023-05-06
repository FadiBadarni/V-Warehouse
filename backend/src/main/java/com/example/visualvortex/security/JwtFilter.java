package com.example.visualvortex.security;

import com.example.visualvortex.services.User.JwtUtil;
import com.example.visualvortex.services.User.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            if (hasJwtToken(request)) {
                String token = extractToken(request);
                authenticateUser(token, request);
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token has expired");
        }
    }


    private boolean hasJwtToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        return Objects.nonNull(authorization) && authorization.startsWith("Bearer ");
    }

    private String extractToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        return authorization.substring("Bearer ".length());
    }

    private void authenticateUser(String token, HttpServletRequest request) {
        String username = jwtUtil.extractUsername(token);
        UserDetails userDetails = userService.loadUserByUsername(username);

        if (jwtUtil.isTokenValid(token, userDetails)) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
}