package com.gotrip.gotrip.service;

import com.gotrip.gotrip.entity.User;
import com.gotrip.gotrip.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register new user
    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Hash password before saving
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // Normal user
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // Find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Verify password
    public boolean checkPassword(
            String rawPassword,
            String encodedPassword) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}