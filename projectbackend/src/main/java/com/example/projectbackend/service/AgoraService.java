package com.example.projectbackend.service;

import com.example.projectbackend.config.AgoraConfig;
import io.agora.media.RtcTokenBuilder;
import io.agora.media.RtcTokenBuilder.Role;
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

            int timestamp = (int) (System.currentTimeMillis() / 1000);
            int privilegeExpiredTs = timestamp + expirationTimeInSeconds;

            Role role = "doctor".equalsIgnoreCase(userRole) 
                ? RtcTokenBuilder.Role.Role_Publisher 
                : RtcTokenBuilder.Role.Role_Subscriber;

            RtcTokenBuilder tokenBuilder = new RtcTokenBuilder();
            String token = tokenBuilder.buildTokenWithUid(
                appId,
                appCertificate,
                channelName,
                Integer.parseInt(userId),
                role,
                privilegeExpiredTs
            );

            return token;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Agora token: " + e.getMessage(), e);
        }
    }
}
