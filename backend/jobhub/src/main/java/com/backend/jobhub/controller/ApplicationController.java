package com.backend.jobhub.controller;

import com.backend.jobhub.dto.CreateApplicationRequest;
import com.backend.jobhub.dto.JobApplicationDTO;
import com.backend.jobhub.dto.UpdateApplicationStatusRequest;
import com.backend.jobhub.dto.UploadedDocumentDTO;
import com.backend.jobhub.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    
    private final JobApplicationService applicationService;
    
    @PostMapping
    public ResponseEntity<JobApplicationDTO> createApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobApplicationDTO application = applicationService.createApplication(request, userDetails.getUsername());
        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsByJob(@PathVariable String jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(userDetails.getUsername()));
    }
    
    @GetMapping("/recruiter")
    public ResponseEntity<List<JobApplicationDTO>> getRecruiterApplications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsForRecruiter(userDetails.getUsername()));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationDTO> updateApplicationStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        JobApplicationDTO application = applicationService.updateApplicationStatus(id, request.getStatus());
        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/{applicationId}/documents/{documentId}")
    public ResponseEntity<UploadedDocumentDTO> downloadDocument(
            @PathVariable String applicationId,
            @PathVariable String documentId
    ) {
        UploadedDocumentDTO document = applicationService.getDocument(applicationId, documentId);
        return ResponseEntity.ok(document);
    }
}
