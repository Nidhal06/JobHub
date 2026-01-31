package com.backend.jobhub.controller;

import com.backend.jobhub.dto.JobApplicationDTO;
import com.backend.jobhub.dto.JobDTO;
import com.backend.jobhub.service.JobApplicationService;
import com.backend.jobhub.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {
    
    private final JobService jobService;
    private final JobApplicationService applicationService;
    
    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getMyJobs(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.getRecruiterJobs(userDetails.getUsername()));
    }
    
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsForRecruiter(userDetails.getUsername()));
    }
}
