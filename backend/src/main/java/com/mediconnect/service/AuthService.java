package com.mediconnect.service;

import com.mediconnect.dto.AuthResponse;
import com.mediconnect.dto.LoginRequest;
import com.mediconnect.dto.ProfileUpdateRequest;
import com.mediconnect.dto.SignupRequest;
import com.mediconnect.model.Role;
import com.mediconnect.model.User;
import com.mediconnect.repository.UserRepository;
import com.mediconnect.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .bloodGroup(request.getBloodGroup())
                .city(request.getCity())
                .specialization(request.getSpecialization())
                .yearsOfExperience(request.getYearsOfExperience())
                .medicalLicenseNumber(request.getMedicalLicenseNumber())
                .consultationFee(request.getConsultationFee())
                .profilePhoto(request.getProfilePhoto())
                .emailVerified(true)
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getRole() == Role.DOCTOR) {
            user.setOnline(true);
            userRepository.save(user);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return toAuthResponse(user, token);
    }

    public AuthResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toAuthResponse(user, null);
    }

    public AuthResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getProfilePhoto() != null) user.setProfilePhoto(request.getProfilePhoto());
        if (request.getBloodGroup() != null) user.setBloodGroup(request.getBloodGroup());
        if (request.getAllergies() != null) user.setAllergies(request.getAllergies());
        if (request.getExistingConditions() != null) user.setExistingConditions(request.getExistingConditions());
        if (request.getCurrentMedications() != null) user.setCurrentMedications(request.getCurrentMedications());
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        if (request.getEmergencyContactName() != null) user.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactNumber() != null) user.setEmergencyContactNumber(request.getEmergencyContactNumber());
        if (request.getRelationshipWithEmergencyContact() != null) user.setRelationshipWithEmergencyContact(request.getRelationshipWithEmergencyContact());
        if (request.getCountry() != null) user.setCountry(request.getCountry());
        if (request.getState() != null) user.setState(request.getState());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getPostalCode() != null) user.setPostalCode(request.getPostalCode());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
        if (request.getMedicalLicenseNumber() != null) user.setMedicalLicenseNumber(request.getMedicalLicenseNumber());
        if (request.getYearsOfExperience() != null) user.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getQualification() != null) user.setQualification(request.getQualification());
        if (request.getHospitalOrClinicName() != null) user.setHospitalOrClinicName(request.getHospitalOrClinicName());
        if (request.getConsultationFee() != null) user.setConsultationFee(request.getConsultationFee());
        if (request.getLanguagesSpoken() != null) user.setLanguagesSpoken(request.getLanguagesSpoken());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAvailableDays() != null) user.setAvailableDays(request.getAvailableDays());
        if (request.getAvailableTimeSlots() != null) user.setAvailableTimeSlots(request.getAvailableTimeSlots());
        if (request.getOnlineConsultationAvailable() != null) user.setOnlineConsultationAvailable(request.getOnlineConsultationAvailable());
        if (request.getOfflineConsultationAvailable() != null) user.setOfflineConsultationAvailable(request.getOfflineConsultationAvailable());
        if (request.getConsultationDuration() != null) user.setConsultationDuration(request.getConsultationDuration());
        if (request.getMedicalLicenseDocument() != null) user.setMedicalLicenseDocument(request.getMedicalLicenseDocument());
        if (request.getGovernmentIdDocument() != null) user.setGovernmentIdDocument(request.getGovernmentIdDocument());
        if (request.getDegreeCertificateDocument() != null) user.setDegreeCertificateDocument(request.getDegreeCertificateDocument());
        if (request.getClinicAddress() != null) user.setClinicAddress(request.getClinicAddress());

        user.setOnboardingComplete(true);
        userRepository.save(user);

        return toAuthResponse(user, null);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .profilePhoto(user.getProfilePhoto())
                .bloodGroup(user.getBloodGroup())
                .allergies(user.getAllergies())
                .existingConditions(user.getExistingConditions())
                .currentMedications(user.getCurrentMedications())
                .height(user.getHeight())
                .weight(user.getWeight())
                .emergencyContactName(user.getEmergencyContactName())
                .emergencyContactNumber(user.getEmergencyContactNumber())
                .relationshipWithEmergencyContact(user.getRelationshipWithEmergencyContact())
                .country(user.getCountry())
                .state(user.getState())
                .city(user.getCity())
                .postalCode(user.getPostalCode())
                .address(user.getAddress())
                .specialization(user.getSpecialization())
                .medicalLicenseNumber(user.getMedicalLicenseNumber())
                .yearsOfExperience(user.getYearsOfExperience())
                .qualification(user.getQualification())
                .hospitalOrClinicName(user.getHospitalOrClinicName())
                .consultationFee(user.getConsultationFee())
                .languagesSpoken(user.getLanguagesSpoken())
                .bio(user.getBio())
                .availableDays(user.getAvailableDays())
                .availableTimeSlots(user.getAvailableTimeSlots())
                .onlineConsultationAvailable(user.getOnlineConsultationAvailable())
                .offlineConsultationAvailable(user.getOfflineConsultationAvailable())
                .consultationDuration(user.getConsultationDuration())
                .medicalLicenseDocument(user.getMedicalLicenseDocument())
                .governmentIdDocument(user.getGovernmentIdDocument())
                .degreeCertificateDocument(user.getDegreeCertificateDocument())
                .clinicAddress(user.getClinicAddress())
                .onboardingComplete(user.isOnboardingComplete())
                .build();
    }
}
