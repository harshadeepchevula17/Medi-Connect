package com.mediconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long appointmentId;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private Long patientId;

    @Column(length = 2000)
    private String medications;

    @Column(length = 2000)
    private String instructions;

    @Column(length = 1000)
    private String notes;

    private String doctorName;

    private LocalDateTime prescribedAt;

    @PrePersist
    protected void onCreate() {
        prescribedAt = LocalDateTime.now();
    }
}
