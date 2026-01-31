package com.backend.jobhub.service;

import com.backend.jobhub.dto.*;
import com.backend.jobhub.entity.User;
import com.backend.jobhub.entity.UserRole;
import com.backend.jobhub.exception.BadRequestException;
import com.backend.jobhub.exception.ResourceNotFoundException;
import com.backend.jobhub.repository.UserRepository;
import com.backend.jobhub.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(token)
                .user(mapToDTO(user))
                .build();
    }
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("An account with this email already exists.");
        }
        
        if (request.getRole() == UserRole.recruiter && (request.getCompany() == null || request.getCompany().isBlank())) {
            throw new BadRequestException("Company is required for recruiter accounts.");
        }
        
        if (request.getRole() == UserRole.seeker && (request.getTitle() == null || request.getTitle().isBlank())) {
            throw new BadRequestException("Role or headline is required for seeker accounts.");
        }
        
        if (request.getRole() == UserRole.admin) {
            throw new BadRequestException("Cannot register as admin.");
        }
        
        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .company(request.getCompany() != null ? request.getCompany().trim() : null)
                .title(request.getTitle() != null ? request.getTitle().trim() : null)
                .build();
        
        user = userRepository.save(user);
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(token)
                .user(mapToDTO(user))
                .build();
    }
    
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }
    
    public UserDTO updateProfile(String email, UserDTO updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (updateRequest.getName() != null) {
            user.setName(updateRequest.getName().trim());
        }
        if (updateRequest.getCompany() != null) {
            user.setCompany(updateRequest.getCompany().trim());
        }
        if (updateRequest.getTitle() != null) {
            user.setTitle(updateRequest.getTitle().trim());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio().trim());
        }
        if (updateRequest.getAvatarUrl() != null) {
            user.setAvatarUrl(updateRequest.getAvatarUrl());
        }
        
        user = userRepository.save(user);
        return mapToDTO(user);
    }
    
    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .company(user.getCompany())
                .title(user.getTitle())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .build();
    }
}
