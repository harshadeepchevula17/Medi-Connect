package com.mediconnect.controller;

import com.mediconnect.model.Prescription;
import com.mediconnect.model.User;
import com.mediconnect.repository.PrescriptionRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;

    public PrescriptionController(PrescriptionRepository prescriptionRepository,
                                   UserRepository userRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails user,
                                    @RequestBody Map<String, Object> body) {
        User doctor = userRepository.findByEmail(user.getUsername()).orElse(null);
        if (doctor == null) return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));

        Long patientId = Long.valueOf(body.get("patientId").toString());
        Long appointmentId = Long.valueOf(body.get("appointmentId").toString());

        Prescription prescription = Prescription.builder()
                .appointmentId(appointmentId)
                .doctorId(doctor.getId())
                .patientId(patientId)
                .doctorName(doctor.getName())
                .medications((String) body.getOrDefault("medications", ""))
                .instructions((String) body.getOrDefault("instructions", ""))
                .notes((String) body.getOrDefault("notes", ""))
                .build();

        prescriptionRepository.save(prescription);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPrescriptions(@AuthenticationPrincipal UserDetails user) {
        User patient = userRepository.findByEmail(user.getUsername()).orElse(null);
        if (patient == null) return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
        return ResponseEntity.ok(prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(patient.getId()));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Prescription>> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(prescriptionRepository.findByAppointmentId(appointmentId));
    }
}
