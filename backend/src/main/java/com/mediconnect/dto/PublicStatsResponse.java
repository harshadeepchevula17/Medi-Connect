package com.mediconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PublicStatsResponse {
    private long activePatients;
    private long specialists;
    private double satisfactionRate;
    private long consultationsCompleted;
    private double aiAccuracyRate;
    private long citiesCovered;
    private double platformUptime;
}
