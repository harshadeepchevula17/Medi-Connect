package com.mediconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(unique = true)
    private String phone;

    private String gender;

    private LocalDate dateOfBirth;

    private String profilePhoto;

    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String existingConditions;

    @Column(columnDefinition = "TEXT")
    private String currentMedications;

    private Double height;

    private Double weight;

    private String emergencyContactName;

    private String emergencyContactNumber;

    private String relationshipWithEmergencyContact;

    private String country;

    private String state;

    private String city;

    private String postalCode;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String specialization;

    private String medicalLicenseNumber;

    private Integer yearsOfExperience;

    private String qualification;

    private String hospitalOrClinicName;

    private Double consultationFee;

    private String languagesSpoken;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String availableDays;

    @Column(columnDefinition = "TEXT")
    private String availableTimeSlots;

    private Boolean onlineConsultationAvailable;

    private Boolean offlineConsultationAvailable;

    private Integer consultationDuration;

    private String medicalLicenseDocument;

    private String governmentIdDocument;

    private String degreeCertificateDocument;

    private String verificationStatus;

    @Builder.Default
    private Boolean verifiedByAdmin = false;

    @Column(columnDefinition = "TEXT")
    private String clinicAddress;

    private Double averageRating;

    private Integer totalReviews;

    private Integer totalPatients;

    private Integer totalConsultations;

    private boolean emailVerified;

    @Builder.Default
    private boolean onboardingComplete = false;

    @Builder.Default
    private boolean enabled = true;

    private boolean online;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
