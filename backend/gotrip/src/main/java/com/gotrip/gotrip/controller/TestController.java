package com.gotrip.gotrip.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Go Trip Backend is Running!";
    }

    @GetMapping("/api/test/protected")
    public String protectedTest(Authentication authentication) {

        return "JWT Authentication Successful! Logged in user: "
                + authentication.getName();
    }
}