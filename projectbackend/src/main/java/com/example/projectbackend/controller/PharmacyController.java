package com.example.projectbackend.controller;

import com.example.projectbackend.model.Pharmacy;
import com.example.projectbackend.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacies")
@RequiredArgsConstructor
public class PharmacyController {
    
    private final PharmacyService pharmacyService;
    
    @GetMapping
    public ResponseEntity<?> getAllPharmaciesRoot() {
        return ResponseEntity.ok(pharmacyService.getAllPharmacies());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPharmacies() {
        return ResponseEntity.ok(pharmacyService.getAllPharmacies());
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createPharmacy(@RequestBody Pharmacy pharmacy) {
        Pharmacy created = pharmacyService.createPharmacy(pharmacy);
        return ResponseEntity.ok(Map.of("pharmacy", created, "message", "Pharmacy created"));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPharmacyByUserId(@PathVariable Long userId) {
        Pharmacy pharmacy = pharmacyService.getPharmacyByUserId(userId);
        return pharmacy != null ? ResponseEntity.ok(pharmacy) : ResponseEntity.notFound().build();
    }
}
