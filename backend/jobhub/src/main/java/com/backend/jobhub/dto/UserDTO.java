package com.backend.jobhub.dto;

import com.backend.jobhub.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private UserRole role;
    private String company;
    private String title;
    private String avatarUrl;
    private String bio;
}
