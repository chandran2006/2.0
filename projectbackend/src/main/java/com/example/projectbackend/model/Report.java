package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String reportType;
    private Long totalCount;
    private LocalDateTime generatedAt = LocalDateTime.now();
    
    @Column(length = 5000)
    private String data;
}
