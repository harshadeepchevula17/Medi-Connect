package com.mediconnect.service;

import com.mediconnect.model.Appointment;
import com.mediconnect.model.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RealTimeService {

    private final SimpMessagingTemplate messagingTemplate;

    public RealTimeService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastDashboardUpdate(Map<String, Object> update) {
        messagingTemplate.convertAndSend("/topic/dashboard", update);
    }

    public void broadcastAppointmentUpdate(Appointment appointment) {
        Map<String, Object> payload = Map.of(
                "type", "APPOINTMENT_UPDATE",
                "data", appointment
        );
        messagingTemplate.convertAndSend("/topic/appointments", payload);
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            messagingTemplate.convertAndSend("/topic/appointments/patient/" + appointment.getPatient().getId(), payload);
        }
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            messagingTemplate.convertAndSend("/topic/appointments/doctor/" + appointment.getDoctor().getId(), payload);
        }
    }

    public void broadcastVitalsUpdate(Map<String, Object> vitals) {
        messagingTemplate.convertAndSend("/topic/vitals", vitals);
    }

    public void broadcastMessage(Message message) {
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), message);
    }

    public void broadcastStatsUpdate(Map<String, Object> stats) {
        messagingTemplate.convertAndSend("/topic/stats", stats);
    }

    public void sendNotification(String userEmail, Map<String, Object> notification) {
        messagingTemplate.convertAndSendToUser(userEmail, "/topic/notifications", notification);
    }
}
