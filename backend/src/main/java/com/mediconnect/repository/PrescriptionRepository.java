package com.mediconnect.repository;

import com.mediconnect.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);
    List<Prescription> findByAppointmentId(Long appointmentId);
    List<Prescription> findByDoctorIdOrderByPrescribedAtDesc(Long doctorId);
}
