package com.mediconnect.dto;

import com.mediconnect.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String profilePhoto;
    private String bloodGroup;
    private String specialization;
    private String city;
    private String hospitalOrClinicName;
    private Boolean verifiedByAdmin;
    private boolean enabled;
    private boolean online;
    private LocalDateTime createdAt;
}
