package com.mediconnect.service;

import com.mediconnect.dto.DashboardData;
import com.mediconnect.model.*;
import com.mediconnect.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final VitalsRecordRepository vitalsRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DocumentRepository documentRepository;
    private final com.mediconnect.repository.ReviewRepository reviewRepository;

    public DashboardService(UserRepository userRepository,
                            AppointmentRepository appointmentRepository,
                            VitalsRecordRepository vitalsRepository,
                            PrescriptionRepository prescriptionRepository,
                            DocumentRepository documentRepository,
                            com.mediconnect.repository.ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.vitalsRepository = vitalsRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.documentRepository = documentRepository;
        this.reviewRepository = reviewRepository;
    }

    public DashboardData getAdminDashboard() {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime todayEnd = todayStart.plusDays(1);

        Map<String, Long> weeklyData = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = LocalDateTime.of(date, LocalTime.MIDNIGHT);
            LocalDateTime end = start.plusDays(1);
            String dayName = date.getDayOfWeek().toString().substring(0, 3);
            long count = appointmentRepository.countByAppointmentTimeBetween(start, end);
            weeklyData.put(dayName, count);
        }

        Map<String, Object> systemHealth = new LinkedHashMap<>();
        systemHealth.put("apiServer", Map.of("status", "operational", "uptime", "99.99%"));
        systemHealth.put("database", Map.of("status", "operational", "uptime", "99.97%"));
        systemHealth.put("aiEngine", Map.of("status", "operational", "uptime", "99.95%"));
        systemHealth.put("webSocket", Map.of("status", "operational", "uptime", "99.99%"));
        systemHealth.put("webRTC", Map.of("status", "operational", "uptime", "99.90%"));

        return DashboardData.builder()
                .totalUsers(userRepository.count())
                .totalDoctors(userRepository.countByRole(Role.DOCTOR))
                .totalPatients(userRepository.countByRole(Role.PATIENT))
                .consultationsToday(appointmentRepository.countByAppointmentTimeBetween(todayStart, todayEnd))
                .totalConsultations(appointmentRepository.count())
                .pendingAppointments(appointmentRepository.countByStatus(Appointment.AppointmentStatus.PENDING))
                .weeklyConsultations(weeklyData)
                .systemHealth(systemHealth)
                .build();
    }

    public Map<String, Object> getPatientDashboard(String email) {
        User patient = userRepository.findByEmail(email).orElse(null);
        if (patient == null) {
            Map<String, Object> empty = new LinkedHashMap<>();
            empty.put("error", "Patient not found");
            return empty;
        }

        List<Appointment> appointments = appointmentRepository.findByPatientOrderByAppointmentTimeDesc(patient);

        VitalsRecord latestVitals = vitalsRepository.findTopByPatientIdOrderByRecordedAtDesc(patient.getId())
                .orElse(null);

        List<Map<String, Object>> recentAppts = appointments.stream().limit(5).map(apt -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", apt.getId());
            String dn = apt.getDoctor().getName();
            m.put("doctorName", dn.startsWith("Dr.") ? dn : "Dr. " + dn);
            m.put("doctorId", apt.getDoctor().getId());
            m.put("date", apt.getAppointmentTime().toString());
            m.put("type", apt.getSymptoms() != null ? apt.getSymptoms() : "Consultation");
            m.put("status", apt.getStatus().name());
            m.put("meetingRoomId", apt.getMeetingRoomId());
            return m;
        }).collect(Collectors.toList());

        List<VitalsRecord> allVitals = vitalsRepository.findByPatientIdOrderByRecordedAtDesc(patient.getId());

        List<Map<String, Object>> allAppts = appointments.stream().map(apt -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", apt.getId());
            m.put("doctorName", apt.getDoctor().getName().startsWith("Dr.") ? apt.getDoctor().getName() : "Dr. " + apt.getDoctor().getName());
            m.put("doctorId", apt.getDoctor().getId());
            m.put("date", apt.getAppointmentTime().toString());
            m.put("symptoms", apt.getSymptoms() != null ? apt.getSymptoms() : "General");
            m.put("status", apt.getStatus().name());
            m.put("meetingRoomId", apt.getMeetingRoomId());
            m.put("notes", apt.getNotes());
            return m;
        }).collect(Collectors.toList());

        List<Map<String, Object>> vitalsList = allVitals.stream().map(v -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", v.getId());
            m.put("recordedAt", v.getRecordedAt().toString());
            m.put("heartRate", v.getHeartRate());
            m.put("bloodPressureSystolic", v.getBloodPressureSystolic());
            m.put("bloodPressureDiastolic", v.getBloodPressureDiastolic());
            m.put("oxygenSaturation", v.getOxygenSaturation());
            m.put("temperature", v.getTemperature());
            m.put("bloodSugar", v.getBloodSugar());
            return m;
        }).collect(Collectors.toList());

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("upcomingAppointments", (int) appointments.stream().filter(a -> a.getStatus() == Appointment.AppointmentStatus.CONFIRMED || a.getStatus() == Appointment.AppointmentStatus.PENDING).count());
        long docCount = documentRepository.countByPatient(patient);
        dashboard.put("medicalRecords", docCount);

        List<Map<String, Object>> prescriptionsMap = prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(patient.getId())
                .stream().map(p -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", p.getId());
                    m.put("doctorName", p.getDoctorName());
                    m.put("medications", p.getMedications());
                    m.put("instructions", p.getInstructions());
                    m.put("notes", p.getNotes());
                    m.put("prescribedAt", p.getPrescribedAt() != null ? p.getPrescribedAt().toString() : "");
                    return m;
                }).collect(Collectors.toList());
        dashboard.put("prescriptions", prescriptionsMap);
        dashboard.put("activePrescriptions", prescriptionsMap.size());
        dashboard.put("healthScore", 0);
        if (latestVitals != null) {
            dashboard.put("vitals", Map.of(
                    "heartRate", latestVitals.getHeartRate(),
                    "bloodPressure", latestVitals.getBloodPressureSystolic() + "/" + latestVitals.getBloodPressureDiastolic(),
                    "oxygenSaturation", latestVitals.getOxygenSaturation(),
                    "temperature", latestVitals.getTemperature()
            ));
        } else {
            dashboard.put("vitals", null);
        }
        dashboard.put("recentConsultations", recentAppts);
        dashboard.put("allConsultations", allAppts);
        dashboard.put("vitalsHistory", vitalsList);

        List<Document> docs = documentRepository.findByPatientOrderByUploadedAtDesc(patient);
        List<Map<String, Object>> docsList = docs.stream().map(d -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", d.getId());
            m.put("fileName", d.getFileName());
            m.put("fileType", d.getFileType());
            m.put("fileSize", d.getFileSize());
            m.put("category", d.getCategory() != null ? d.getCategory() : "");
            m.put("uploadedAt", d.getUploadedAt() != null ? d.getUploadedAt().toString() : "");
            return m;
        }).collect(Collectors.toList());
        dashboard.put("documents", docsList);

        return dashboard;
    }

    public Map<String, Object> getDoctorDashboard(String email) {
        User doctor = userRepository.findByEmail(email).orElse(null);
        if (doctor == null) {
            Map<String, Object> empty = new LinkedHashMap<>();
            empty.put("error", "Doctor not found");
            return empty;
        }

        List<Appointment> appointments = appointmentRepository.findByDoctorOrderByAppointmentTimeDesc(doctor);
        List<Appointment> pendingAppointments = appointmentRepository.findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.PENDING);

        List<Map<String, Object>> schedule = appointments.stream().limit(8).map(apt -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", apt.getId());
            m.put("patientName", apt.getPatient().getName());
            m.put("patientEmail", apt.getPatient().getEmail());
            m.put("time", apt.getAppointmentTime().toLocalTime().toString());
            m.put("type", apt.getSymptoms() != null ? apt.getSymptoms() : "Consultation");
            m.put("status", apt.getStatus().name());
            m.put("meetingRoomId", apt.getMeetingRoomId());
            return m;
        }).collect(Collectors.toList());

        List<Map<String, Object>> requests = pendingAppointments.stream().map(apt -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", apt.getId());
            m.put("patientName", apt.getPatient().getName());
            m.put("patientEmail", apt.getPatient().getEmail());
            m.put("symptoms", apt.getSymptoms() != null ? apt.getSymptoms() : "Not specified");
            m.put("requestedAt", apt.getCreatedAt() != null ? apt.getCreatedAt().toString() : "");
            return m;
        }).collect(Collectors.toList());

        long totalPatients = appointmentRepository.countByDoctor(doctor);

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("totalPatients", totalPatients);
        dashboard.put("todayAppointments", appointments.size());
        dashboard.put("pendingReviews", pendingAppointments.size());
        // compute average rating for doctor
        try {
            List<com.mediconnect.model.Review> reviews = reviewRepository.findByDoctor(doctor);
            double avg = 0.0;
            if (reviews != null && !reviews.isEmpty()) {
                double sum = reviews.stream().mapToInt(r -> r.getRating()).sum();
                avg = Math.round((sum / reviews.size()) * 10.0) / 10.0;
            } else if (doctor.getAverageRating() != null) {
                avg = doctor.getAverageRating();
            }
            dashboard.put("averageRating", avg);
        } catch (Exception ex) {
            dashboard.put("averageRating", doctor.getAverageRating() != null ? doctor.getAverageRating() : 0.0);
        }
        dashboard.put("schedule", schedule);
        dashboard.put("pendingRequests", requests);
        dashboard.put("aiAlerts", Collections.emptyList());

        return dashboard;
    }
}
