package com.example.projectbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;

@SpringBootApplication
public class ProjectbackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectbackendApplication.class, args);
    }
}

@Component
class NetworkInfoLogger {
    
    @EventListener(ApplicationReadyEvent.class)
    public void logNetworkInfo() {
        try {
            String localIP = getLocalIP();
            System.out.println("\n" + "=".repeat(60));
            System.out.println("🌐 MeDora Backend Server Started");
            System.out.println("=".repeat(60));
            System.out.println("📍 Local Access:    http://localhost:8080");
            System.out.println("📍 Network Access:  http://" + localIP + ":8080");
            System.out.println("📍 API Base:        http://" + localIP + ":8080/api");
            System.out.println("📍 Test Endpoint:   http://" + localIP + ":8080/api/auth/test-db");
            System.out.println("=".repeat(60) + "\n");
        } catch (Exception e) {
            System.err.println("Could not determine network IP: " + e.getMessage());
        }
    }
    
    private String getLocalIP() throws Exception {
        Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
        while (interfaces.hasMoreElements()) {
            NetworkInterface iface = interfaces.nextElement();
            if (iface.isLoopback() || !iface.isUp()) continue;
            
            Enumeration<InetAddress> addresses = iface.getInetAddresses();
            while (addresses.hasMoreElements()) {
                InetAddress addr = addresses.nextElement();
                if (addr.isSiteLocalAddress() && addr.getHostAddress().indexOf(':') == -1) {
                    return addr.getHostAddress();
                }
            }
        }
        return InetAddress.getLocalHost().getHostAddress();
    }
}
