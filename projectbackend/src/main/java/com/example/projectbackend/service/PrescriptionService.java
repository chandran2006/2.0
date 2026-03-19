package com.example.projectbackend.service;

import com.example.projectbackend.model.Prescription;
import com.example.projectbackend.model.User;
import com.example.projectbackend.repository.PrescriptionRepository;
import com.example.projectbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    
    private Map<String, Object> enrich(Prescription p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("patientId", p.getPatientId());
        map.put("doctorId", p.getDoctorId());
        map.put("medicineName", p.getMedicineName());
        map.put("dosage", p.getDosage());
        map.put("duration", p.getDuration());
        map.put("instructions", p.getInstructions());
        map.put("status", p.getStatus());
        map.put("isTaken", p.getIsTaken());
        map.put("createdAt", p.getCreatedAt());
        if (p.getPatientId() != null) {
            userRepository.findById(p.getPatientId()).ifPresent(u -> map.put("patientName", u.getName()));
        }
        if (p.getDoctorId() != null) {
            userRepository.findById(p.getDoctorId()).ifPresent(u -> map.put("doctorName", u.getName()));
        }
        return map;
    }

    public List<Map<String, Object>> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream().map(this::enrich).collect(Collectors.toList());
    }

    public Prescription updateStatus(Long id, String status) {
        Prescription prescription = prescriptionRepository.findById(id).orElseThrow();
        prescription.setStatus(Prescription.Status.valueOf(status));
        return prescriptionRepository.save(prescription);
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    public List<Map<String, Object>> getPatientPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream().map(this::enrich).collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getDoctorPrescriptions(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId).stream().map(this::enrich).collect(Collectors.toList());
    }
    
    public Prescription markAsTaken(Long id) {
        Prescription prescription = prescriptionRepository.findById(id).orElseThrow();
        prescription.setIsTaken(true);
        return prescriptionRepository.save(prescription);
    }
    
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
