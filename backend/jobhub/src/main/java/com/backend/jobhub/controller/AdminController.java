package com.backend.jobhub.controller;

import com.backend.jobhub.dto.JobDTO;
import com.backend.jobhub.dto.UpdateJobStatusRequest;
import com.backend.jobhub.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final JobService jobService;
    
    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
    
    @GetMapping("/jobs/pending")
    public ResponseEntity<List<JobDTO>> getPendingJobs() {
        return ResponseEntity.ok(jobService.getPendingJobs());
    }
    
    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<JobDTO> updateJobStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateJobStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDTO job = jobService.updateJobStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(job);
    }
}
