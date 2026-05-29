package com.mediconnect.repository;

import com.mediconnect.model.Review;
import com.mediconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctor(User doctor);
    List<Review> findByDoctorId(Long doctorId);
}
