package com.example.projectbackend.service;

import com.example.projectbackend.model.Pharmacy;
import com.example.projectbackend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyService {
    
    private final PharmacyRepository pharmacyRepository;
    
    public List<Pharmacy> getAllPharmacies() {
        return pharmacyRepository.findAll();
    }
    
    public Pharmacy createPharmacy(Pharmacy pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }
    
    public Pharmacy getPharmacyByUserId(Long userId) {
        return pharmacyRepository.findByUserId(userId).orElse(null);
    }
}
