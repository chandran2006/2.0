package com.example.projectbackend.controller;

import com.example.projectbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    
    @GetMapping("/consultations")
    public ResponseEntity<?> getConsultationReport() {
        long total = appointmentRepository.count();
        return ResponseEntity.ok(Map.of("totalConsultations", total));
    }
    
    @GetMapping("/prescriptions")
    public ResponseEntity<?> getPrescriptionReport() {
        long total = prescriptionRepository.count();
        return ResponseEntity.ok(Map.of("totalPrescriptions", total));
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getUserReport() {
        long total = userRepository.count();
        return ResponseEntity.ok(Map.of("totalUsers", total));
    }
}
