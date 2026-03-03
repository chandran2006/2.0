package com.example.projectbackend.service;

import com.example.projectbackend.config.AgoraConfig;
import io.agora.media.RtcTokenBuilder;
import org.springframework.stereotype.Service;

@Service
public class AgoraService {

    private final AgoraConfig agoraConfig;

    public AgoraService(AgoraConfig agoraConfig) {
        this.agoraConfig = agoraConfig;
    }

    public String generateRtcToken(String channelName, String userId, String userRole) {
        try {
            String appId = agoraConfig.getAppId();
            String appCertificate = agoraConfig.getAppCertificate();
            int expirationTimeInSeconds = agoraConfig.getTokenExpiration();

            System.out.println("=== Generating Agora Token ===");
            System.out.println("App ID: " + appId);
            System.out.println("Channel: " + channelName);
            System.out.println("User ID: " + userId);

            int uid = 0;
            try {
                uid = Integer.parseInt(userId);
            } catch (NumberFormatException e) {
                uid = 0;
            }

            System.out.println("Using UID: " + uid);

            int timestamp = (int) (System.currentTimeMillis() / 1000);
            int privilegeExpiredTs = timestamp + expirationTimeInSeconds;

            RtcTokenBuilder tokenBuilder = new RtcTokenBuilder();
            String token = tokenBuilder.buildTokenWithUid(
                appId,
                appCertificate,
                channelName,
                uid,
                RtcTokenBuilder.Role.Role_Publisher,
                privilegeExpiredTs
            );

            System.out.println("Generated token: " + token.substring(0, Math.min(30, token.length())) + "...");

            return token;
        } catch (Exception e) {
            System.err.println("Failed to generate token: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate Agora token: " + e.getMessage(), e);
        }
    }
}
