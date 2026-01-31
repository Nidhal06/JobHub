package com.backend.jobhub.dto;

import com.backend.jobhub.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String id;
    private String message;
    private String createdAt;
    private boolean read;
    private NotificationType type;
}
