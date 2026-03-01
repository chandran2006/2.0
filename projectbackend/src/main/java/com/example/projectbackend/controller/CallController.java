package com.example.projectbackend.controller;

import com.example.projectbackend.model.Call;
import com.example.projectbackend.service.CallService;
import com.example.projectbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
public class CallController {
    
    private final CallService callService;
    private final UserService userService;
    
    @PostMapping("/initiate")
    public ResponseEntity<?> initiateCall(@RequestBody Map<String, Object> request) {
        Long initiatorId = Long.valueOf(request.get("initiatorId").toString());
        Long receiverId = Long.valueOf(request.get("receiverId").toString());
        String callType = request.get("callType").toString();
        Call call = callService.initiateCall(initiatorId, receiverId, callType);
        return ResponseEntity.ok(Map.of("call", call, "message", "Call initiated"));
    }
    
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptCall(@PathVariable Long id) {
        Call call = callService.acceptCall(id);
        return ResponseEntity.ok(Map.of("call", call, "message", "Call accepted"));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectCall(@PathVariable Long id) {
        Call call = callService.rejectCall(id);
        return ResponseEntity.ok(Map.of("call", call, "message", "Call rejected"));
    }
    
    @PutMapping("/{id}/end")
    public ResponseEntity<?> endCall(@PathVariable Long id) {
        Call call = callService.endCall(id);
        return ResponseEntity.ok(Map.of("call", call, "message", "Call ended"));
    }
    
    @GetMapping("/incoming/{userId}")
    public ResponseEntity<?> getIncomingCalls(@PathVariable Long userId) {
        return ResponseEntity.ok(callService.getIncomingCalls(userId));
    }
    
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getCallHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(callService.getCallHistory(userId));
    }
    
    @PostMapping("/doctor/online")
    public ResponseEntity<?> doctorOnline(@RequestBody Map<String, Object> request) {
        try {
            Long doctorId = Long.valueOf(request.get("doctorId").toString());
            System.out.println("Doctor going online: " + doctorId);
            userService.updateAvailability(doctorId, true);
            return ResponseEntity.ok(Map.of("message", "Doctor is now online", "success", true));
        } catch (Exception e) {
            System.err.println("Error in doctorOnline: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @PostMapping("/doctor/offline")
    public ResponseEntity<?> doctorOffline(@RequestBody Map<String, Object> request) {
        try {
            Long doctorId = Long.valueOf(request.get("doctorId").toString());
            System.out.println("Doctor going offline: " + doctorId);
            userService.updateAvailability(doctorId, false);
            return ResponseEntity.ok(Map.of("message", "Doctor is now offline", "success", true));
        } catch (Exception e) {
            System.err.println("Error in doctorOffline: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @GetMapping("/doctors/available")
    public ResponseEntity<?> getAvailableDoctors() {
        return ResponseEntity.ok(userService.getAvailableDoctors());
    }
}
