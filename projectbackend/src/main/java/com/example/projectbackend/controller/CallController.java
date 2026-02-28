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
    public ResponseEntity<?> doctorOnline(@RequestBody Map<String, Long> request) {
        userService.updateAvailability(request.get("doctorId"), true);
        return ResponseEntity.ok(Map.of("message", "Doctor is now online"));
    }
    
    @PostMapping("/doctor/offline")
    public ResponseEntity<?> doctorOffline(@RequestBody Map<String, Long> request) {
        userService.updateAvailability(request.get("doctorId"), false);
        return ResponseEntity.ok(Map.of("message", "Doctor is now offline"));
    }
    
    @GetMapping("/doctors/available")
    public ResponseEntity<?> getAvailableDoctors() {
        return ResponseEntity.ok(userService.getAvailableDoctors());
    }
}
