package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pharmacy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String pharmacyName;
    private String address;
    private Double latitude;
    private Double longitude;
    private String phone;
    private String openingHours;
    private String licenseNumber;
    private Double rating = 0.0;
    private LocalDateTime createdAt = LocalDateTime.now();
}
