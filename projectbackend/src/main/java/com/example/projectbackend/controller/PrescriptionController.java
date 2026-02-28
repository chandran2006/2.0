package com.example.projectbackend.controller;

import com.example.projectbackend.model.Prescription;
import com.example.projectbackend.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    
    private final PrescriptionService prescriptionService;
    
    @PostMapping("/create")
    public ResponseEntity<?> createPrescription(@RequestBody Prescription prescription) {
        Prescription created = prescriptionService.createPrescription(prescription);
        return ResponseEntity.ok(Map.of("prescription", created, "message", "Prescription created"));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getPatientPrescriptions(patientId));
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorPrescriptions(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getDoctorPrescriptions(doctorId));
    }
    
    @PutMapping("/{id}/mark-taken")
    public ResponseEntity<?> markAsTaken(@PathVariable Long id) {
        Prescription updated = prescriptionService.markAsTaken(id);
        return ResponseEntity.ok(Map.of("prescription", updated, "message", "Marked as taken"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok(Map.of("message", "Prescription deleted"));
    }
}
