package com.example.projectbackend.controller;

import com.example.projectbackend.service.AgoraService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/agora")
@CrossOrigin(origins = "http://localhost:5173")
public class AgoraController {

    private final AgoraService agoraService;

    public AgoraController(AgoraService agoraService) {
        this.agoraService = agoraService;
    }

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> generateToken(
            @RequestParam String channelName,
            @RequestParam String userId,
            @RequestParam(defaultValue = "patient") String role
    ) {
        String token = agoraService.generateRtcToken(channelName, userId, role);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("channelName", channelName);
        response.put("userId", userId);

        return ResponseEntity.ok(response);
    }
}
