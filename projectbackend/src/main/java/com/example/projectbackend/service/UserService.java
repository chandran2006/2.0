package com.example.projectbackend.service;

import com.example.projectbackend.model.User;
import com.example.projectbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemSettingsService settingsService;
    
    public User register(User user) {
        try {
            // Check if email already exists
            Optional<User> existing = userRepository.findByEmail(user.getEmail());
            if (existing.isPresent()) {
                throw new RuntimeException("Email already registered");
            }
            
            // Encode password
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            
            // Save user
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            System.err.println("Error in UserService.register: " + e.getMessage());
            throw e;
        }
    }
    
    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            // Check if user is blocked
            if (Boolean.TRUE.equals(user.get().getBlocked())) {
                throw new RuntimeException("Your account has been blocked. Please contact the administrator.");
            }
            
            // Check maintenance mode (allow only admins)
            try {
                var settings = settingsService.getSettings();
                if (Boolean.TRUE.equals(settings.getMaintenanceMode()) && 
                    user.get().getRole() != User.Role.ADMIN) {
                    throw new RuntimeException("System is currently under maintenance. Please try again later.");
                }
            } catch (RuntimeException e) {
                throw e;
            } catch (Exception e) {
                // If settings service fails, allow login
                System.err.println("Failed to check maintenance mode: " + e.getMessage());
            }
            
            if (passwordEncoder.matches(password, user.get().getPassword())) {
                return user;
            }
        }
        return Optional.empty();
    }
    
    public List<User> getDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR);
    }
    
    public List<User> getAvailableDoctors() {
        try {
            List<User> doctors = userRepository.findByRoleAndIsAvailable(User.Role.DOCTOR, true);
            System.out.println("[UserService] Found " + doctors.size() + " available doctors");
            doctors.forEach(d -> System.out.println("  - Doctor: " + d.getName() + " (ID: " + d.getId() + ", Available: " + d.getIsAvailable() + ")"));
            return doctors;
        } catch (Exception e) {
            System.err.println("[UserService] Error getting available doctors: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public User updateAvailability(Long doctorId, Boolean isAvailable) {
        try {
            System.out.println("[UserService] Updating availability for doctor " + doctorId + " to " + isAvailable);
            
            User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
            
            System.out.println("[UserService] Found doctor: " + doctor.getName() + ", Current availability: " + doctor.getIsAvailable());
            
            doctor.setIsAvailable(isAvailable);
            User saved = userRepository.save(doctor);
            
            System.out.println("[UserService] Doctor availability updated successfully: " + saved.getIsAvailable());
            System.out.println("[UserService] Saved doctor ID: " + saved.getId() + ", Name: " + saved.getName());
            
            return saved;
        } catch (Exception e) {
            System.err.println("[UserService] Error updating availability: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public long getUserCount() {
        return userRepository.count();
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User toggleBlockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(!Boolean.TRUE.equals(user.getBlocked()));
        return userRepository.save(user);
    }
}
