package com.example.projectbackend.service;

import com.example.projectbackend.model.Appointment;
import com.example.projectbackend.model.AppointmentDTO;
import com.example.projectbackend.model.User;
import com.example.projectbackend.repository.AppointmentRepository;
import com.example.projectbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    private AppointmentDTO toDTO(Appointment apt) {
        String patientName = userRepository.findById(apt.getPatientId())
            .map(User::getName).orElse("Unknown Patient");
        User doctor = userRepository.findById(apt.getDoctorId()).orElse(null);
        String doctorName = doctor != null ? doctor.getName() : "Unknown Doctor";
        String doctorSpec = doctor != null ? doctor.getSpecialization() : null;
        return AppointmentDTO.builder()
            .id(apt.getId())
            .patientId(apt.getPatientId())
            .doctorId(apt.getDoctorId())
            .patientName(patientName)
            .doctorName(doctorName)
            .doctorSpecialization(doctorSpec)
            .reason(apt.getSymptoms())
            .appointmentDate(apt.getAppointmentDate())
            .status(apt.getStatus().name())
            .consultationType(apt.getConsultationType())
            .createdAt(apt.getCreatedAt())
            .build();
    }
    
    public Appointment createAppointment(@org.springframework.lang.NonNull Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
    
    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
            .map(this::toDTO).collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
            .map(this::toDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
            .map(this::toDTO).collect(Collectors.toList());
    }
    
    public Appointment updateStatus(Long id, Appointment.Status status) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
    
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
