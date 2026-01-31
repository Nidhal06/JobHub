package com.backend.jobhub.controller;

import com.backend.jobhub.dto.JobApplicationDTO;
import com.backend.jobhub.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seeker")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SEEKER')")
public class SeekerController {
    
    private final JobApplicationService applicationService;
    
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(userDetails.getUsername()));
    }
}
