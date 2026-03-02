package com.example.projectbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgoraConfig {

    @Value("${agora.app.id}")
    private String appId;

    @Value("${agora.app.certificate}")
    private String appCertificate;

    @Value("${agora.token.expiration:3600}")
    private int tokenExpiration;

    public String getAppId() {
        return appId;
    }

    public String getAppCertificate() {
        return appCertificate;
    }

    public int getTokenExpiration() {
        return tokenExpiration;
    }
}
