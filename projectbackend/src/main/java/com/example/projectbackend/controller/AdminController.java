package com.example.projectbackend.controller;

import com.example.projectbackend.model.User;
import com.example.projectbackend.model.SystemSettings;
import com.example.projectbackend.service.UserService;
import com.example.projectbackend.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final UserService userService;
    private final SystemSettingsService settingsService;
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            System.out.println("[AdminController] Fetching all users...");
            var users = userService.getAllUsers();
            System.out.println("[AdminController] Found " + users.size() + " users");
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("[AdminController] Error fetching users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error fetching users: " + e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<?> toggleBlockUser(@PathVariable Long id) {
        try {
            User user = userService.toggleBlockUser(id);
            String status = Boolean.TRUE.equals(user.getBlocked()) ? "blocked" : "unblocked";
            return ResponseEntity.ok(Map.of(
                "user", user,
                "message", "User " + status + " successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/settings")
    public ResponseEntity<?> getSettings() {
        try {
            return ResponseEntity.ok(settingsService.getSettings());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
    
    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody SystemSettings settings) {
        try {
            System.out.println("Updating settings: " + settings);
            SystemSettings updated = settingsService.updateSettings(settings);
            System.out.println("Settings updated successfully: " + updated);
            return ResponseEntity.ok(Map.of(
                "settings", updated,
                "message", "Settings updated successfully"
            ));
        } catch (Exception e) {
            System.err.println("Error updating settings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/settings/reset")
    public ResponseEntity<?> resetSettings() {
        try {
            SystemSettings defaults = settingsService.resetToDefaults();
            return ResponseEntity.ok(Map.of(
                "settings", defaults,
                "message", "Settings reset to defaults"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
}
