package com.mediconnect.repository;

import com.mediconnect.model.Document;
import com.mediconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByPatientOrderByUploadedAtDesc(User patient);
    long countByPatient(User patient);
}
