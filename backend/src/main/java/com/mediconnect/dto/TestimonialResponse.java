package com.mediconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TestimonialResponse {
    private String quote;
    private String author;
    private String role;
    private String avatar;
    private int rating;
}
