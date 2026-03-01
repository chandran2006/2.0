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
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
    
    public List<User> getDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR);
    }
    
    public List<User> getAvailableDoctors() {
        return userRepository.findByRoleAndIsAvailable(User.Role.DOCTOR, true);
    }
    
    public User updateAvailability(Long doctorId, Boolean isAvailable) {
        User doctor = userRepository.findById(doctorId).orElseThrow();
        doctor.setIsAvailable(isAvailable);
        return userRepository.save(doctor);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public long getUserCount() {
        return userRepository.count();
    }
}
