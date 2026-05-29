package com.mediconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private String name;
    private String specialization;
    private double rating;
    private long patientsCount;
    private boolean online;
    private String imageInitials;
}
