package com.example.projectbackend.service;

import com.example.projectbackend.model.Medicine;
import com.example.projectbackend.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {
    
    private final MedicineRepository medicineRepository;
    
    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.findByNameContainingIgnoreCase(query);
    }
    
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }
    
    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }
    
    public Medicine updateStock(Long id, Integer stockLevel) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow();
        medicine.setStockLevel(stockLevel);
        medicine.setAvailability(stockLevel > 0);
        return medicineRepository.save(medicine);
    }
    
    public List<Medicine> getPharmacyMedicines(Long pharmacyId) {
        return medicineRepository.findByPharmacyId(pharmacyId);
    }
}
