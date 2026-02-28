package com.example.projectbackend.controller;

import com.example.projectbackend.model.HealthRecord;
import com.example.projectbackend.repository.HealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/health-records")
@RequiredArgsConstructor
public class HealthRecordController {
    
    private final HealthRecordRepository healthRecordRepository;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadRecord(@RequestBody HealthRecord record) {
        HealthRecord saved = healthRecordRepository.save(record);
        return ResponseEntity.ok(Map.of("record", saved, "message", "Record uploaded"));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(healthRecordRepository.findByPatientId(patientId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        healthRecordRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted"));
    }
}
