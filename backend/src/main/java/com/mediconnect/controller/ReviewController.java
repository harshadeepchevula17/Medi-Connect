package com.mediconnect.controller;

import com.mediconnect.model.Review;
import com.mediconnect.model.User;
import com.mediconnect.repository.ReviewRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportReview(@AuthenticationPrincipal UserDetails userDetails,
                                          @PathVariable Long id,
                                          @RequestBody Map<String, Object> body) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        Review review = reviewRepository.findById(id).orElse(null);
        if (review == null) return ResponseEntity.badRequest().body(Map.of("error", "Review not found"));

        String reason = body.get("reason") != null ? body.get("reason").toString().trim() : "";
        if (reason.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "Reason is required"));

        review.setReported(true);
        review.setReportReason(reason);
        review.setReportedAt(LocalDateTime.now());
        reviewRepository.save(review);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getReviewsForDoctor(@PathVariable Long doctorId) {
        User doctor = userRepository.findById(doctorId).orElse(null);
        if (doctor == null) return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
        List<Review> reviews = reviewRepository.findByDoctor(doctor);
        return ResponseEntity.ok(reviews);
    }
}
