package com.example.projectbackend.controller;

import com.example.projectbackend.model.User;
import com.example.projectbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("Registration attempt for: " + user.getEmail());
            User registered = userService.register(user);
            System.out.println("Registration successful for: " + registered.getEmail());
            return ResponseEntity.ok(Map.of("user", registered, "message", "Registration successful"));
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        System.out.println("Login attempt for: " + email);
        
        return userService.login(email, password)
                .map(user -> {
                    System.out.println("Login successful for: " + email);
                    return ResponseEntity.ok(Map.of("user", user, "message", "Login successful"));
                })
                .orElseGet(() -> {
                    System.err.println("Login failed for: " + email);
                    return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
                });
    }
    
    @GetMapping("/current-user/{id}")
    public ResponseEntity<?> getCurrentUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/test-db")
    public ResponseEntity<?> testDatabase() {
        long userCount = userService.getUserCount();
        System.out.println("Database check - Total users: " + userCount);
        return ResponseEntity.ok(Map.of(
            "message", "Database connection successful",
            "userCount", userCount
        ));
    }
}
