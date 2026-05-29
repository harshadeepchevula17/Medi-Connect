package com.mediconnect.controller;

import com.mediconnect.model.Message;
import com.mediconnect.repository.MessageRepository;
import com.mediconnect.service.RealTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final MessageRepository messageRepository;
    private final RealTimeService realTimeService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(MessageRepository messageRepository,
                          RealTimeService realTimeService,
                          SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.realTimeService = realTimeService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId) {
        return ResponseEntity.ok(messageRepository.findByRoomIdOrderByTimestampAsc(roomId));
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now());
        Message saved = messageRepository.save(message);
        realTimeService.broadcastMessage(saved);
        return ResponseEntity.ok(saved);
    }

    @MessageMapping("/chat.send")
    public void broadcastMessage(@Payload Message message) {
        message.setTimestamp(LocalDateTime.now());
        Message saved = messageRepository.save(message);
        realTimeService.broadcastMessage(saved);
    }

    @MessageMapping("/signal")
    public void relaySignal(@Payload Map<String, Object> payload) {
        String roomId = (String) payload.get("roomId");
        if (roomId != null) {
            messagingTemplate.convertAndSend("/topic/signal/" + roomId, payload);
        }
    }
}
