package com.mediconnect.service;

import com.mediconnect.dto.*;
import com.mediconnect.model.*;
import com.mediconnect.repository.*;
import com.mediconnect.model.Review;
import com.mediconnect.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PublicService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final TestimonialRepository testimonialRepository;
    private final ReviewRepository reviewRepository;

    public PublicService(UserRepository userRepository,
                         AppointmentRepository appointmentRepository,
                         TestimonialRepository testimonialRepository,
                         ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.testimonialRepository = testimonialRepository;
        this.reviewRepository = reviewRepository;
    }

    public PublicStatsResponse getStats() {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime todayEnd = todayStart.plusDays(1);

        long totalPatients = userRepository.countByRole(Role.PATIENT);
        long totalDoctors = userRepository.countByRole(Role.DOCTOR);
        long consultationsToday = appointmentRepository.countByAppointmentTimeBetween(todayStart, todayEnd);
        long totalConsultations = appointmentRepository.count();

        return PublicStatsResponse.builder()
                .activePatients(totalPatients)
                .specialists(totalDoctors)
                .satisfactionRate(0)
                .consultationsCompleted(totalConsultations)
                .aiAccuracyRate(0)
                .citiesCovered(0)
                .platformUptime(0)
                .build();
    }

    public List<DoctorResponse> getDoctors() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.DOCTOR)
                .map(doc -> DoctorResponse.builder()
                        .id(doc.getId())
                        .name(doc.getName().startsWith("Dr.") ? doc.getName() : "Dr. " + doc.getName())
                        .specialization(doc.getSpecialization() != null ? doc.getSpecialization() : "General Medicine")
                        .rating(computeAverageRatingForDoctor(doc))
                        .patientsCount(0)
                        .online(doc.isOnline())
                        .imageInitials(getInitials(doc.getName()))
                        .build()
                ).collect(Collectors.toList());
    }

    private double computeAverageRatingForDoctor(User doc) {
        if (doc == null || doc.getId() == null) return 0.0;
        try {
            List<Review> reviews = reviewRepository.findByDoctorId(doc.getId());
            if (reviews == null || reviews.isEmpty()) return 0.0;
            double sum = reviews.stream().mapToInt(Review::getRating).sum();
            return Math.round((sum / reviews.size()) * 10.0) / 10.0;
        } catch (Exception ex) {
            return doc.getAverageRating() != null ? doc.getAverageRating() : 0.0;
        }
    }

    public List<TestimonialResponse> getTestimonials() {
        List<Testimonial> testimonials = testimonialRepository.findByFeaturedTrue();

        return testimonials.stream().map(t -> TestimonialResponse.builder()
                .quote(t.getQuote())
                .author(t.getAuthor())
                .role(t.getRole())
                .avatar(t.getAvatar() != null ? t.getAvatar() : getInitials(t.getAuthor()))
                .rating(t.getRating())
                .build()
        ).collect(Collectors.toList());
    }

    public TestimonialResponse submitTestimonial(String username, Map<String, Object> body) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Unauthorized");
        }

        User patient = userRepository.findByEmail(username).orElse(null);
        if (patient == null) {
            throw new IllegalArgumentException("Patient not found");
        }

        Object appointmentIdValue = body.get("appointmentId");
        if (appointmentIdValue == null) {
            throw new IllegalArgumentException("Missing appointmentId");
        }

        Long appointmentId = Long.valueOf(appointmentIdValue.toString());
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment not found");
        }

        if (appointment.getPatient() == null || !appointment.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException("Appointment does not belong to this patient");
        }

        if (appointment.getStatus() != Appointment.AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Review is available after consultation is completed");
        }

        Object ratingValue = body.get("rating");
        int rating = ratingValue == null ? 0 : Integer.parseInt(ratingValue.toString());
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        String quote = body.get("quote") != null ? body.get("quote").toString().trim() : "";
        if (quote.isBlank()) {
            throw new IllegalArgumentException("Review text is required");
        }

        Testimonial testimonial = Testimonial.builder()
                .quote(quote)
                .author(patient.getName())
                .role("Patient")
                .avatar(getInitials(patient.getName()))
                .rating(rating)
                .featured(false)
                .build();

        Testimonial saved = testimonialRepository.save(testimonial);

        // If a doctorId is provided, save a per-doctor Review and update doctor's aggregates
        Object doctorIdVal = body.get("doctorId");
        if (doctorIdVal != null) {
            try {
                Long doctorId = Long.valueOf(doctorIdVal.toString());
                User doctor = userRepository.findById(doctorId).orElse(null);
                if (doctor != null) {
                        Review.ReviewBuilder rb = Review.builder()
                            .appointment(appointment)
                            .doctor(doctor)
                            .patient(patient)
                            .rating(rating)
                            .comment(quote)
                            .reported(false);

                        Object reportFlag = body.get("report");
                        Object reportReasonObj = body.get("reportReason");
                        if (reportFlag != null && Boolean.parseBoolean(reportFlag.toString())) {
                        rb.reported(true);
                        String rr = reportReasonObj != null ? reportReasonObj.toString() : "";
                        rb.reportReason(rr);
                        rb.reportedAt(java.time.LocalDateTime.now());
                        }

                        Review review = rb.build();
                        reviewRepository.save(review);

                    int prevCount = doctor.getTotalReviews() != null ? doctor.getTotalReviews() : 0;
                    double prevAvg = doctor.getAverageRating() != null ? doctor.getAverageRating() : 0.0;
                    int newCount = prevCount + 1;
                    double newAvg = ((prevAvg * prevCount) + rating) / newCount;
                    doctor.setTotalReviews(newCount);
                    doctor.setAverageRating(Math.round(newAvg * 10.0) / 10.0);
                    userRepository.save(doctor);
                }
            } catch (Exception ex) {
                // ignore non-critical doctor update errors
            }
        }

        return TestimonialResponse.builder()
                .quote(saved.getQuote())
                .author(saved.getAuthor())
                .role(saved.getRole())
                .avatar(saved.getAvatar())
                .rating(saved.getRating())
                .build();
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank()) return "?";
        return java.util.Arrays.stream(name.split(" "))
                .filter(s -> !s.isEmpty())
                .map(s -> String.valueOf(s.charAt(0)))
                .collect(Collectors.joining())
                .toUpperCase();
    }
}
