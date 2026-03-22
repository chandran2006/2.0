package com.example.projectbackend.controller;

import com.example.projectbackend.model.Call;
import com.example.projectbackend.service.CallService;
import com.example.projectbackend.service.UserService;
import com.example.projectbackend.service.AgoraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
public class CallController {
    
    private final CallService callService;
    private final UserService userService;
    private final AgoraService agoraService;
    
    @PostMapping("/initiate")
    public ResponseEntity<?> initiateCall(@RequestBody Map<String, Object> request) {
        Long initiatorId = Long.valueOf(request.get("initiatorId").toString());
        Long receiverId = Long.valueOf(request.get("receiverId").toString());
        String callType = request.get("callType").toString();
        
        Call call = callService.initiateCall(initiatorId, receiverId, callType);
        
        // Use consistent channel name based on call ID
        String channelName = "call-" + call.getId();
        // Update roomId to match channelName for consistency
        call.setRoomId(channelName);
        
        String initiatorToken = agoraService.generateRtcToken(channelName, initiatorId.toString(), "patient");
        String receiverToken = agoraService.generateRtcToken(channelName, receiverId.toString(), "doctor");
        
        Map<String, Object> response = new HashMap<>();
        response.put("call", call);
        response.put("channelName", channelName);
        response.put("initiatorToken", initiatorToken);
        response.put("receiverToken", receiverToken);
        response.put("message", "Call initiated");
        
        return ResponseEntity.ok(response);
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
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCall(@PathVariable Long id) {
        Call call = callService.getCall(id);
        return ResponseEntity.ok(call);
    }
    
    @GetMapping("/incoming/{userId}")
    public ResponseEntity<?> getIncomingCalls(@PathVariable Long userId) {
        var calls = callService.getIncomingCalls(userId);
        // Enrich with initiator (patient) name
        var enriched = calls.stream().map(call -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", call.getId());
            map.put("initiatorId", call.getInitiatorId());
            map.put("receiverId", call.getReceiverId());
            map.put("callType", call.getCallType());
            map.put("status", call.getStatus());
            map.put("roomId", "call-" + call.getId());
            map.put("channelName", "call-" + call.getId());
            map.put("createdAt", call.getStartedAt());
            userService.findById(call.getInitiatorId()).ifPresent(u -> {
                map.put("patientName", u.getName());
                map.put("patientEmail", u.getEmail());
            });
            return map;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(enriched);
    }
    
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getCallHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(callService.getCallHistory(userId));
    }
    
    @PostMapping("/doctor/online")
    public ResponseEntity<?> doctorOnline(@RequestBody Map<String, Object> request) {
        try {
            Object doctorIdObj = request.get("doctorId");
            if (doctorIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "doctorId is required", "success", false));
            }
            
            Long doctorId = Long.valueOf(doctorIdObj.toString());
            System.out.println("[CallController] Doctor going online: " + doctorId);
            
            var doctor = userService.updateAvailability(doctorId, true);
            System.out.println("[CallController] Doctor status updated: " + doctor.getIsAvailable());
            
            return ResponseEntity.ok(Map.of(
                "message", "Doctor is now online", 
                "success", true,
                "doctorId", doctorId,
                "isAvailable", doctor.getIsAvailable()
            ));
        } catch (Exception e) {
            System.err.println("[CallController] Error in doctorOnline: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @PostMapping("/doctor/offline")
    public ResponseEntity<?> doctorOffline(@RequestBody Map<String, Object> request) {
        try {
            Object doctorIdObj = request.get("doctorId");
            if (doctorIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "doctorId is required", "success", false));
            }
            
            Long doctorId = Long.valueOf(doctorIdObj.toString());
            System.out.println("[CallController] Doctor going offline: " + doctorId);
            
            var doctor = userService.updateAvailability(doctorId, false);
            System.out.println("[CallController] Doctor status updated: " + doctor.getIsAvailable());
            
            return ResponseEntity.ok(Map.of(
                "message", "Doctor is now offline", 
                "success", true,
                "doctorId", doctorId,
                "isAvailable", doctor.getIsAvailable()
            ));
        } catch (Exception e) {
            System.err.println("[CallController] Error in doctorOffline: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @GetMapping("/doctors/available")
    public ResponseEntity<?> getAvailableDoctors() {
        try {
            var doctors = userService.getAvailableDoctors();
            System.out.println("[CallController] Available doctors count: " + doctors.size());
            return ResponseEntity.ok(Map.of(
                "doctors", doctors,
                "count", doctors.size()
            ));
        } catch (Exception e) {
            System.err.println("[CallController] Error getting available doctors: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
