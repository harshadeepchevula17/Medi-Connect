package com.mediconnect.dto;

import com.mediconnect.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private Role role = Role.PATIENT;

    private String phone;

    private String gender;

    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String city;

    private String specialization;

    private Integer yearsOfExperience;

    private String medicalLicenseNumber;

    private Double consultationFee;

    private String profilePhoto;
}
