package com.mediconnect.controller;

import com.mediconnect.dto.*;
import com.mediconnect.service.PublicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    @GetMapping("/stats")
    public ResponseEntity<PublicStatsResponse> getStats() {
        return ResponseEntity.ok(publicService.getStats());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getDoctors() {
        return ResponseEntity.ok(publicService.getDoctors());
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialResponse>> getTestimonials() {
        return ResponseEntity.ok(publicService.getTestimonials());
    }

    @PostMapping("/testimonials")
    public ResponseEntity<?> submitTestimonial(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.ok(publicService.submitTestimonial(
                    userDetails != null ? userDetails.getUsername() : null,
                    body
            ));
        } catch (IllegalArgumentException ex) {
            if ("Unauthorized".equals(ex.getMessage())) {
                return ResponseEntity.status(401).body(Map.of("error", ex.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
