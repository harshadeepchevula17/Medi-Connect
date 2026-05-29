package com.mediconnect.repository;

import com.mediconnect.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByFeaturedTrue();
    List<Testimonial> findByRatingGreaterThanEqual(int minRating);
}
