package com.example.projectbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
public class SymptomController {
    
    @PostMapping("/check")
    public ResponseEntity<?> checkSymptoms(@RequestBody Map<String, Object> request) {
        List<String> symptoms = (List<String>) request.get("symptoms");
        
        List<Map<String, Object>> conditions = new ArrayList<>();
        conditions.add(Map.of("condition", "Common Cold", "confidence", 75, "severity", "Low"));
        conditions.add(Map.of("condition", "Flu", "confidence", 60, "severity", "Medium"));
        conditions.add(Map.of("condition", "Allergies", "confidence", 45, "severity", "Low"));
        
        return ResponseEntity.ok(Map.of(
            "symptoms", symptoms,
            "possibleConditions", conditions,
            "recommendation", "Consult a doctor if symptoms persist"
        ));
    }
    
    @GetMapping("/common")
    public ResponseEntity<?> getCommonSymptoms() {
        List<String> symptoms = Arrays.asList(
            "Fever", "Cough", "Headache", "Fatigue", "Sore Throat",
            "Body Ache", "Nausea", "Dizziness", "Chest Pain"
        );
        return ResponseEntity.ok(symptoms);
    }
}
