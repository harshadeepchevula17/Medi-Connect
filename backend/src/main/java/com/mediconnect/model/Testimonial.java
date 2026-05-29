package com.mediconnect.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "testimonials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Testimonial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String quote;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String role;

    private String avatar;

    private int rating;

    private boolean featured;
}
