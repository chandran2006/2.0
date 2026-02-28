package com.example.projectbackend.service;

import com.example.projectbackend.model.Prescription;
import com.example.projectbackend.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    public List<Prescription> getPatientPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }
    
    public List<Prescription> getDoctorPrescriptions(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
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
