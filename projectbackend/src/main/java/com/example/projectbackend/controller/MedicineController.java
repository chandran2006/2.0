package com.example.projectbackend.controller;

import com.example.projectbackend.model.Medicine;
import com.example.projectbackend.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {
    
    private final MedicineService medicineService;
    
    @GetMapping("/search")
    public ResponseEntity<?> searchMedicines(@RequestParam String q) {
        return ResponseEntity.ok(medicineService.searchMedicines(q));
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createMedicine(@RequestBody Medicine medicine) {
        Medicine created = medicineService.createMedicine(medicine);
        return ResponseEntity.ok(Map.of("medicine", created, "message", "Medicine added"));
    }
    
    @PutMapping("/{id}/update-stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        Medicine updated = medicineService.updateStock(id, request.get("stockLevel"));
        return ResponseEntity.ok(Map.of("medicine", updated, "message", "Stock updated"));
    }
    
    @GetMapping("/pharmacy/{pharmacyId}")
    public ResponseEntity<?> getPharmacyMedicines(@PathVariable Long pharmacyId) {
        return ResponseEntity.ok(medicineService.getPharmacyMedicines(pharmacyId));
    }
}
