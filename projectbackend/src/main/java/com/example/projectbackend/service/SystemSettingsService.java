package com.example.projectbackend.service;

import com.example.projectbackend.model.SystemSettings;
import com.example.projectbackend.repository.SystemSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SystemSettingsService {
    
    private final SystemSettingsRepository settingsRepository;
    
    public SystemSettings getSettings() {
        return settingsRepository.findAll().stream()
            .findFirst()
            .orElseGet(this::createDefaultSettings);
    }
    
    public SystemSettings updateSettings(SystemSettings settings) {
        SystemSettings existing = getSettings();
        if (settings.getSiteName() != null) existing.setSiteName(settings.getSiteName());
        if (settings.getAdminEmail() != null) existing.setAdminEmail(settings.getAdminEmail());
        if (settings.getSupportEmail() != null) existing.setSupportEmail(settings.getSupportEmail());
        if (settings.getMaxAppointments() != null) existing.setMaxAppointments(settings.getMaxAppointments());
        if (settings.getSessionTimeout() != null) existing.setSessionTimeout(settings.getSessionTimeout());
        if (settings.getEmailNotifications() != null) existing.setEmailNotifications(settings.getEmailNotifications());
        if (settings.getSmsNotifications() != null) existing.setSmsNotifications(settings.getSmsNotifications());
        if (settings.getMaintenanceMode() != null) existing.setMaintenanceMode(settings.getMaintenanceMode());
        return settingsRepository.save(existing);
    }
    
    public SystemSettings resetToDefaults() {
        SystemSettings existing = getSettings();
        settingsRepository.delete(existing);
        return createDefaultSettings();
    }
    
    private SystemSettings createDefaultSettings() {
        SystemSettings defaults = SystemSettings.builder()
            .siteName("TeleAsha 2.0")
            .adminEmail("admin@teleasha.com")
            .supportEmail("support@teleasha.com")
            .maxAppointments(50)
            .sessionTimeout(30)
            .emailNotifications(true)
            .smsNotifications(false)
            .maintenanceMode(false)
            .build();
        return settingsRepository.save(defaults);
    }
}
