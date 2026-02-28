package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    
    @Column(length = 1000)
    private String symptoms;
    
    @Column(length = 2000)
    private String notes;
    
    private String consultationType;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum Status {
        PENDING, APPROVED, COMPLETED, CANCELLED, REJECTED
    }
}
