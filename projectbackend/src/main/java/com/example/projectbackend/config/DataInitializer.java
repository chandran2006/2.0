package com.example.projectbackend.config;

import com.example.projectbackend.model.*;
import com.example.projectbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final PharmacyRepository pharmacyRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        System.out.println("=== Starting Data Initialization ===");
        
        // Check if demo accounts exist with correct domain
        boolean needsInit = userRepository.findByEmail("patient1@medora.com").isEmpty();
        
        if (!needsInit) {
            System.out.println("Demo accounts already exist.");
            System.out.println("Total users in database: " + userRepository.count());
            return;
        }
        
        // Clean up old accounts if they exist
        userRepository.findByEmail("patient1@teleasha.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("dr.sharma@teleasha.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("pharmacy@teleasha.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("admin@teleasha.com").ifPresent(userRepository::delete);
        
        // Create sample users
        User patient = User.builder()
                .email("patient1@medora.com")
                .password(passwordEncoder.encode("password123"))
                .name("Ramesh Kumar")
                .role(User.Role.PATIENT)
                .phone("9876543210")
                .address("Mumbai, India")
                .build();
        userRepository.save(patient);
        System.out.println("Created patient: " + patient.getEmail());
        
        User doctor = User.builder()
                .email("dr.sharma@medora.com")
                .password(passwordEncoder.encode("password123"))
                .name("Dr. Sharma")
                .role(User.Role.DOCTOR)
                .specialization("Cardiology")
                .licenseNumber("DOC12345")
                .phone("9876543211")
                .isAvailable(true)
                .build();
        userRepository.save(doctor);
        System.out.println("Created doctor: " + doctor.getEmail());
        
        User pharmacyUser = User.builder()
                .email("pharmacy@medora.com")
                .password(passwordEncoder.encode("pharmacy123"))
                .name("MedPlus Pharmacy")
                .role(User.Role.PHARMACY)
                .pharmacyName("MedPlus Pharmacy")
                .licenseNumber("PHARM12345")
                .phone("9876543212")
                .address("Delhi, India")
                .build();
        userRepository.save(pharmacyUser);
        System.out.println("Created pharmacy: " + pharmacyUser.getEmail());
        
        User admin = User.builder()
                .email("admin@medora.com")
                .password(passwordEncoder.encode("admin123"))
                .name("Admin User")
                .role(User.Role.ADMIN)
                .phone("9876543213")
                .build();
        userRepository.save(admin);
        System.out.println("Created admin: " + admin.getEmail());
        
        // Create pharmacy
        Pharmacy pharmacy = Pharmacy.builder()
                .userId(pharmacyUser.getId())
                .pharmacyName("MedPlus Pharmacy")
                .address("Delhi, India")
                .latitude(28.6139)
                .longitude(77.2090)
                .phone("9876543212")
                .openingHours("9 AM - 9 PM")
                .licenseNumber("PHARM12345")
                .rating(4.5)
                .build();
        pharmacyRepository.save(pharmacy);
        
        // Create sample medicines
        String[] medicines = {"Aspirin", "Paracetamol", "Amoxicillin", "Ibuprofen", "Metformin"};
        for (String med : medicines) {
            Medicine medicine = Medicine.builder()
                    .name(med)
                    .genericName(med + " Generic")
                    .manufacturer("Pharma Corp")
                    .dosageForm("Tablet")
                    .dosageStrength("500mg")
                    .price(50.0)
                    .availability(true)
                    .pharmacyId(pharmacy.getId())
                    .stockLevel(100)
                    .sideEffects("Mild nausea, headache")
                    .description("Common pain reliever")
                    .build();
            medicineRepository.save(medicine);
        }
        System.out.println("=== Data Initialization Complete ===");
        System.out.println("Total users in database: " + userRepository.count());
    }
}
