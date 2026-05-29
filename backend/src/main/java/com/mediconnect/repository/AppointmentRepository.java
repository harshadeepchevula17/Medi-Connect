package com.mediconnect.repository;

import com.mediconnect.model.Appointment;
import com.mediconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentTimeDesc(User patient);
    List<Appointment> findByDoctorOrderByAppointmentTimeDesc(User doctor);
    List<Appointment> findByDoctorAndStatus(User doctor, Appointment.AppointmentStatus status);
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);
    long countByStatus(Appointment.AppointmentStatus status);
    long countByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);
    long countByDoctor(User doctor);
}
