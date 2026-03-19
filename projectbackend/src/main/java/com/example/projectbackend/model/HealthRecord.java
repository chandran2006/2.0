package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private String type;
    private String doctor;
    private String result;
    private String date;
    private String recordType;
    
    @Column(length = 2000)
    private String description;
    
    private String fileUrl;
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(length = 2000)
    private String doctorNotes;
}
