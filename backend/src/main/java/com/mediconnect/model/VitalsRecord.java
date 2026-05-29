package com.mediconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vitals_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalsRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    private int heartRate;
    private int bloodPressureSystolic;
    private int bloodPressureDiastolic;
    private int oxygenSaturation;
    private double temperature;
    private int bloodSugar;

    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        recordedAt = LocalDateTime.now();
    }
}
