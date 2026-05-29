package com.mediconnect.service;

import com.mediconnect.dto.AiChatRequest;
import com.mediconnect.dto.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AiService {

    private final RestClient restClient;
    private final String model;
    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    private static final String SYSTEM_PROMPT = """
        You are MEDI, an advanced medical AI assistant. Your role:
        - Provide helpful, accurate health information
        - Analyze symptoms and suggest possible causes
        - Recommend when to see a doctor
        - Help with medication management
        - Assist with appointment scheduling
        - Always include appropriate disclaimers
        - Never diagnose definitively — always recommend consulting a professional
        - Be concise but thorough in your responses
        - For emergencies, immediately advise calling emergency services
        """;

    public AiService(@Value("${groq.api.key}") String apiKey,
                     @Value("${groq.api.url}") String apiUrl,
                     @Value("${groq.model}") String model) {
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public AiChatResponse processMessage(AiChatRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = java.util.UUID.randomUUID().toString();
        }

        String history = sessions.getOrDefault(sessionId, "");
        String messages = request.getMessage();

        sessions.put(sessionId, history + "\nUser: " + messages);

        String responseText = callGroq(messages);
        String intent = detectIntent(messages);

        return AiChatResponse.builder()
                .message(responseText)
                .sessionId(sessionId)
                .timestamp(LocalDateTime.now())
                .intent(intent)
                .build();
    }

    private String callGroq(String message) {
        try {
            Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                    Map.of("role", "system", "content", SYSTEM_PROMPT),
                    Map.of("role", "user", "content", message)
                ),
                "temperature", 0.7,
                "max_tokens", 1024
            );

            Map response = restClient.post()
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> msg = (Map<String, Object>) choice.get("message");
                    return (String) msg.get("content");
                }
            }
            return "I'm having trouble connecting to my knowledge base. Please try again.";
        } catch (Exception e) {
            return "I apologize, but I encountered an error. Please try your question again.";
        }
    }

    private String detectIntent(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("emergency") || lower.contains("chest pain") || lower.contains("severe")) return "EMERGENCY";
        if (lower.contains("appointment") || lower.contains("schedule") || lower.contains("book")) return "APPOINTMENT";
        if (lower.contains("medication") || lower.contains("prescription") || lower.contains("drug")) return "MEDICATION";
        if (lower.contains("symptom") || lower.contains("pain") || lower.contains("fever") || lower.contains("cough")) return "SYMPTOM_CHECK";
        if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey")) return "GREETING";
        return "GENERAL";
    }
}
