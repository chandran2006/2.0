package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String genericName;
    private String manufacturer;
    private String dosageForm;
    private String dosageStrength;
    private Double price;
    private Boolean available = true;
    private Long pharmacyId;
    
    @Column(length = 1000)
    private String sideEffects;
    
    @Column(length = 2000)
    private String description;
    
    private Integer stockLevel = 0;
}
