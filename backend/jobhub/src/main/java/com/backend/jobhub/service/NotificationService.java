package com.backend.jobhub.service;

import com.backend.jobhub.dto.CreateNotificationRequest;
import com.backend.jobhub.dto.NotificationDTO;
import com.backend.jobhub.entity.Notification;
import com.backend.jobhub.entity.NotificationType;
import com.backend.jobhub.entity.User;
import com.backend.jobhub.exception.ResourceNotFoundException;
import com.backend.jobhub.repository.NotificationRepository;
import com.backend.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    public List<NotificationDTO> getNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }
    
    public NotificationDTO createNotification(String email, CreateNotificationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Notification notification = Notification.builder()
                .userId(user.getId())
                .message(request.getMessage())
                .type(request.getType())
                .read(false)
                .build();
        
        notification = notificationRepository.save(notification);
        return mapToDTO(notification);
    }
    
    public void pushNotification(String userId, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .read(false)
                .build();
        
        notificationRepository.save(notification);
    }
    
    public NotificationDTO markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        notification.setRead(true);
        notification = notificationRepository.save(notification);
        
        return mapToDTO(notification);
    }
    
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .createdAt(notification.getCreatedAt() != null ? notification.getCreatedAt().toString() : null)
                .read(notification.isRead())
                .type(notification.getType())
                .build();
    }
}
