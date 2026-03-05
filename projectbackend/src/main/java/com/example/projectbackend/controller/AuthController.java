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
            System.out.println("=== Registration Request ===");
            System.out.println("Email: " + user.getEmail());
            System.out.println("Name: " + user.getName());
            System.out.println("Role: " + user.getRole());
            
            // Validate required fields
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name is required"));
            }
            if (user.getRole() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Role is required"));
            }
            
            User registered = userService.register(user);
            System.out.println("Registration successful - User ID: " + registered.getId());
            return ResponseEntity.ok(Map.of("user", registered, "message", "Registration successful"));
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            System.out.println("=== Login Request ===");
            System.out.println("Email: " + email);
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }
            
            return userService.login(email, password)
                    .map(user -> {
                        System.out.println("Login successful for: " + email + " (ID: " + user.getId() + ")");
                        return ResponseEntity.ok(Map.of("user", user, "message", "Login successful"));
                    })
                    .orElseGet(() -> {
                        System.err.println("Login failed - Invalid credentials for: " + email);
                        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
                    });
        } catch (RuntimeException e) {
            if (e.getMessage().contains("blocked")) {
                return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
            }
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Login failed: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Login failed: " + e.getMessage()));
        }
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
