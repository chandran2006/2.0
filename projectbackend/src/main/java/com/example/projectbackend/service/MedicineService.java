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
    
    public Medicine updateMedicine(Long id, Medicine data) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow();
        medicine.setName(data.getName());
        medicine.setGenericName(data.getGenericName());
        medicine.setManufacturer(data.getManufacturer());
        medicine.setDosageForm(data.getDosageForm());
        medicine.setDosageStrength(data.getDosageStrength());
        medicine.setPrice(data.getPrice());
        medicine.setStockLevel(data.getStockLevel());
        medicine.setAvailable(data.getStockLevel() > 0);
        medicine.setDescription(data.getDescription());
        return medicineRepository.save(medicine);
    }

    public Medicine updateStock(Long id, Integer stockLevel) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow();
        medicine.setStockLevel(stockLevel);
        medicine.setAvailable(stockLevel > 0);
        return medicineRepository.save(medicine);
    }
    
    public List<Medicine> getPharmacyMedicines(Long pharmacyId) {
        return medicineRepository.findByPharmacyId(pharmacyId);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}
