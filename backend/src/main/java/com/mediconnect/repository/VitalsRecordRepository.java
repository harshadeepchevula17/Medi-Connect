package com.mediconnect.repository;

import com.mediconnect.model.VitalsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VitalsRecordRepository extends JpaRepository<VitalsRecord, Long> {
    List<VitalsRecord> findByPatientIdOrderByRecordedAtDesc(Long patientId);
    Optional<VitalsRecord> findTopByPatientIdOrderByRecordedAtDesc(Long patientId);
    List<VitalsRecord> findByRecordedAtBetween(LocalDateTime start, LocalDateTime end);
}
