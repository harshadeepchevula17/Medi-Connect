package com.mediconnect.controller;

import com.mediconnect.model.Appointment;
import com.mediconnect.model.User;
import com.mediconnect.repository.AppointmentRepository;
import com.mediconnect.repository.UserRepository;
import com.mediconnect.service.RealTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final RealTimeService realTimeService;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                  UserRepository userRepository,
                                  RealTimeService realTimeService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.realTimeService = realTimeService;
    }

    @PostMapping("/book")
    public ResponseEntity<?> book(@AuthenticationPrincipal UserDetails user,
                                   @RequestBody Map<String, Object> body) {
        User patient = userRepository.findByEmail(user.getUsername()).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
        }

        Long doctorId = Long.valueOf(body.get("doctorId").toString());
        User doctor = userRepository.findById(doctorId).orElse(null);
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentTime(LocalDateTime.now().plusHours(1))
                .status(Appointment.AppointmentStatus.PENDING)
                .symptoms((String) body.getOrDefault("symptoms", ""))
                .meetingRoomId(UUID.randomUUID().toString().substring(0, 8))
                .build();

        appointmentRepository.save(appointment);

        realTimeService.broadcastAppointmentUpdate(appointment);

        return ResponseEntity.ok(appointment);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(apt -> {
                    apt.setStatus(Appointment.AppointmentStatus.CONFIRMED);
                    appointmentRepository.save(apt);
                    realTimeService.broadcastAppointmentUpdate(apt);
                    return ResponseEntity.ok(apt);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(apt -> {
                    apt.setStatus(Appointment.AppointmentStatus.CANCELLED);
                    appointmentRepository.save(apt);
                    realTimeService.broadcastAppointmentUpdate(apt);
                    return ResponseEntity.ok(apt);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/begin")
    public ResponseEntity<?> begin(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(apt -> {
                    apt.setStatus(Appointment.AppointmentStatus.IN_PROGRESS);
                    appointmentRepository.save(apt);
                    realTimeService.broadcastAppointmentUpdate(apt);
                    return ResponseEntity.ok(apt);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<?> finish(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(apt -> {
                    apt.setStatus(Appointment.AppointmentStatus.COMPLETED);
                    appointmentRepository.save(apt);
                    realTimeService.broadcastAppointmentUpdate(apt);
                    return ResponseEntity.ok(apt);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, Object> body) {
        try {
            Object idObj = body.get("id");
            if (idObj == null) return ResponseEntity.badRequest().body(Map.of("error", "missing id"));
            Long id = Long.valueOf(idObj.toString());
            String newStatus = (String) body.get("status");
            return appointmentRepository.findById(id)
                    .map(apt -> {
                        try {
                            apt.setStatus(Appointment.AppointmentStatus.valueOf(newStatus));
                        } catch (Exception e) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status: " + newStatus));
                        }
                        appointmentRepository.save(apt);
                        realTimeService.broadcastAppointmentUpdate(apt);
                        return ResponseEntity.ok(apt);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(@AuthenticationPrincipal UserDetails user) {
        User patient = userRepository.findByEmail(user.getUsername()).orElse(null);
        if (patient == null) return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
        return ResponseEntity.ok(appointmentRepository.findByPatientOrderByAppointmentTimeDesc(patient));
    }

    @PostMapping("/echo")
    public ResponseEntity<?> echo(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(body);
    }

    @GetMapping("/doctor/pending")
    public ResponseEntity<?> getPendingForDoctor(@AuthenticationPrincipal UserDetails user) {
        User doctor = userRepository.findByEmail(user.getUsername()).orElse(null);
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
        }
        return ResponseEntity.ok(appointmentRepository.findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.PENDING));
    }

    @PostMapping("/list")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
