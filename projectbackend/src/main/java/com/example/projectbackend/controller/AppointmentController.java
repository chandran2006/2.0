package com.example.projectbackend.controller;

import com.example.projectbackend.model.Appointment;
import com.example.projectbackend.service.AppointmentService;
import com.example.projectbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    private final UserService userService;
    
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors() {
        return ResponseEntity.ok(userService.getDoctors());
    }
    
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        Appointment created = appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(Map.of("appointment", created, "message", "Appointment booked"));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAppointment(@PathVariable Long id) {
        Appointment updated = appointmentService.updateStatus(id, Appointment.Status.APPROVED);
        return ResponseEntity.ok(Map.of("appointment", updated, "message", "Appointment approved"));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAppointment(@PathVariable Long id) {
        Appointment updated = appointmentService.updateStatus(id, Appointment.Status.REJECTED);
        return ResponseEntity.ok(Map.of("appointment", updated, "message", "Appointment rejected"));
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id) {
        Appointment updated = appointmentService.updateStatus(id, Appointment.Status.COMPLETED);
        return ResponseEntity.ok(Map.of("appointment", updated, "message", "Appointment completed"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled"));
    }
}
