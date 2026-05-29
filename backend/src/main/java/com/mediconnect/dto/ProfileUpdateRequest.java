package com.mediconnect.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileUpdateRequest {
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String profilePhoto;
    private String bloodGroup;
    private String allergies;
    private String existingConditions;
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
    private String address;
    private String specialization;
    private String medicalLicenseNumber;
    private Integer yearsOfExperience;
    private String qualification;
    private String hospitalOrClinicName;
    private Double consultationFee;
    private String languagesSpoken;
    private String bio;
    private String availableDays;
    private String availableTimeSlots;
    private Boolean onlineConsultationAvailable;
    private Boolean offlineConsultationAvailable;
    private Integer consultationDuration;
    private String medicalLicenseDocument;
    private String governmentIdDocument;
    private String degreeCertificateDocument;
    private String clinicAddress;
}
