package com.mediconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class DashboardData {
    private long totalUsers;
    private long totalDoctors;
    private long totalPatients;
    private long consultationsToday;
    private long totalConsultations;
    private long pendingAppointments;
    private Map<String, Long> weeklyConsultations;
    private Map<String, Object> systemHealth;
}
