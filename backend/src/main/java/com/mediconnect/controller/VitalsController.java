package com.mediconnect.controller;

import com.mediconnect.model.User;
import com.mediconnect.repository.UserRepository;
import com.mediconnect.repository.VitalsRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vitals")
public class VitalsController {

    private final VitalsRecordRepository vitalsRepository;
    private final UserRepository userRepository;

    public VitalsController(VitalsRecordRepository vitalsRepository, UserRepository userRepository) {
        this.vitalsRepository = vitalsRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyVitals(@AuthenticationPrincipal UserDetails user) {
        User patient = userRepository.findByEmail(user.getUsername()).orElse(null);
        if (patient == null) return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
        return ResponseEntity.ok(vitalsRepository.findByPatientIdOrderByRecordedAtDesc(patient.getId()));
    }
}
