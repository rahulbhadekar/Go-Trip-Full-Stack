package com.gotrip.gotrip.controller;

import com.gotrip.gotrip.entity.User;
import com.gotrip.gotrip.service.JwtService;
import com.gotrip.gotrip.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        try {

            User savedUser =
                    userService.registerUser(user);

            savedUser.setPassword(null);

            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginRequest) {

        return userService
                .findByEmail(loginRequest.getEmail())
                .map(user -> {

                    boolean passwordCorrect =
                            userService.checkPassword(
                                    loginRequest.getPassword(),
                                    user.getPassword()
                            );

                    if (!passwordCorrect) {

                        return ResponseEntity
                                .badRequest()
                                .body("Invalid email or password");
                    }


                    // Generate JWT
                    String token =
                            jwtService.generateToken(
                                    user.getEmail(),
                                    user.getRole()
                            );


                    // Response object
                    LoginResponse response =
                            new LoginResponse(
                                    token,
                                    user.getId(),
                                    user.getName(),
                                    user.getEmail(),
                                    user.getRole()
                            );

                    return ResponseEntity.ok(response);

                })
                .orElse(
                        ResponseEntity
                                .badRequest()
                                .body("Invalid email or password")
                );
    }


    // =========================
    // LOGIN RESPONSE
    // =========================

    public static class LoginResponse {

        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;


        public LoginResponse(
                String token,
                Long id,
                String name,
                String email,
                String role) {

            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }


        public String getToken() {
            return token;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}