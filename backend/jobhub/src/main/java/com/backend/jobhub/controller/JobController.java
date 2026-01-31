package com.backend.jobhub.controller;

import com.backend.jobhub.dto.CreateJobRequest;
import com.backend.jobhub.dto.JobDTO;
import com.backend.jobhub.dto.UpdateJobStatusRequest;
import com.backend.jobhub.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    
    private final JobService jobService;
    
    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getApprovedJobs());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<JobDTO>> getAllJobsIncludingPending() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<JobDTO>> getPendingJobs() {
        return ResponseEntity.ok(jobService.getPendingJobs());
    }
    
    @PostMapping
    public ResponseEntity<JobDTO> createJob(
            @Valid @RequestBody CreateJobRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDTO job = jobService.createJob(request, userDetails.getUsername());
        return ResponseEntity.ok(job);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobDTO> updateJobStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateJobStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDTO job = jobService.updateJobStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(job);
    }
}
