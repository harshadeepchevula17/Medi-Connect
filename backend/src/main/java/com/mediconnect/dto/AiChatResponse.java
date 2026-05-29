package com.mediconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AiChatResponse {
    private String message;
    private String sessionId;
    private LocalDateTime timestamp;
    private String intent;
}
