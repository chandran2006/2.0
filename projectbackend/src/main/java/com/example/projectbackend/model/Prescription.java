package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private Long doctorId;
    private Long medicineId;
    private String medicineName;
    private String dosage;
    private String duration;
    
    @Column(length = 1000)
    private String instructions;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    
    private Boolean isTaken = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime expiresAt;
    
    public enum Status {
        ACTIVE, COMPLETED, CANCELLED
    }
}
