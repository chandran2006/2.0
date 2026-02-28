package com.example.projectbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/webrtc")
@RequiredArgsConstructor
public class WebRTCController {
    
    private final Map<String, List<Map<String, Object>>> signals = new HashMap<>();
    
    @PostMapping("/signal")
    public ResponseEntity<?> sendSignal(@RequestBody Map<String, Object> signal) {
        String userId = signal.get("to").toString();
        signals.computeIfAbsent(userId, k -> new ArrayList<>()).add(signal);
        return ResponseEntity.ok(Map.of("message", "Signal sent"));
    }
    
    @GetMapping("/signal/{userId}")
    public ResponseEntity<?> getSignals(@PathVariable String userId) {
        List<Map<String, Object>> userSignals = signals.getOrDefault(userId, new ArrayList<>());
        signals.remove(userId);
        return ResponseEntity.ok(userSignals);
    }
    
    @PostMapping("/join-room")
    public ResponseEntity<?> joinRoom(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(Map.of("message", "Joined room", "roomId", request.get("roomId")));
    }
}
