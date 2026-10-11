package com.gotrip.gotrip.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // Security configuration
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // Disable CSRF for REST API
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})


                // JWT based authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // AUTH
                        // =========================

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // =========================
                        // TOURS
                        // =========================

                        // Anyone can view tours
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tours/**"
                        ).permitAll()

                        // Only ADMIN can add tours
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/tours/**"
                        ).hasRole("ADMIN")

                        // Only ADMIN can edit tours
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tours/**"
                        ).hasRole("ADMIN")

                        // Only ADMIN can delete tours
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/tours/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // BOOKINGS
                        // =========================

                        // Booking currently public
                        // We will secure this later
                        .requestMatchers(
                                "/api/bookings/**"
                        ).permitAll()


                        // =========================
                        // TEST API
                        // =========================

                        .requestMatchers(
                                "/api/test"
                        ).permitAll()


                                // CONTACT ENQUIRIES

// Anyone can submit an enquiry
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/contact-enquiries"
                                ).permitAll()

// Only ADMIN can view enquiries
                                .requestMatchers(
                                        "/api/contact-enquiries/**"
                                ).hasRole("ADMIN")


                        // =========================
                        // USERS
                        // =========================

                        // Only ADMIN can manage users
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // ADMIN
                        // =========================

                        // Only ADMIN can access admin APIs
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // EVERYTHING ELSE
                        // =========================

                        .anyRequest().authenticated()
                )


                // Add JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://127.0.0.1:5500",
                "http://localhost:5500"
        ));

        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
                "Authorization", "Content-Type"
        ));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}