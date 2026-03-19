package com.example.projectbackend.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String patientName;
    private String doctorName;
    private String doctorSpecialization;
    private String reason;
    private LocalDateTime appointmentDate;
    private String status;
    private String consultationType;
    private LocalDateTime createdAt;
}
