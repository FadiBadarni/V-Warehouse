package com.example.visualvortex.config;

import com.example.visualvortex.security.JwtFilter;
import com.example.visualvortex.security.LoginSuccessHandler;
import com.example.visualvortex.services.User.CustomerUserdetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;
    private final JwtFilter jwtFilter;
    private final CustomerUserdetailsService customerUserdetailsService;

    private final String[] PUBLIC_ENDPOINTS = new String[]{
            "/",
            "/api/login",
            "/api/logout"
    };

    @Bean
    SecurityFilterChain getSecurityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable()
                .cors(customizer -> customizer.configurationSource(corsConfigurationSource()))
                .authorizeRequests(authorizer -> {
                    authorizer
                            .antMatchers(PUBLIC_ENDPOINTS).permitAll()
                            .antMatchers("/admin/**").hasAuthority("ADMIN")
                            .anyRequest().authenticated();
                })
                .authenticationProvider(authProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling()
                .authenticationEntryPoint(
                        (request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                .and();
        return httpSecurity.build();
    }

    @Bean
    LoginSuccessHandler successHandler() {
        return new LoginSuccessHandler();
    }


    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customerUserdetailsService);
        authProvider.setPasswordEncoder(PasswordEncoderFactories.createDelegatingPasswordEncoder());
        return authProvider;
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
