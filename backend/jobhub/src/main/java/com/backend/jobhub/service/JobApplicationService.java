package com.backend.jobhub.service;

import com.backend.jobhub.dto.CreateApplicationRequest;
import com.backend.jobhub.dto.JobApplicationDTO;
import com.backend.jobhub.dto.UploadedDocumentDTO;
import com.backend.jobhub.entity.ApplicationStatus;
import com.backend.jobhub.entity.Job;
import com.backend.jobhub.entity.JobApplication;
import com.backend.jobhub.entity.UploadedDocument;
import com.backend.jobhub.entity.User;
import com.backend.jobhub.exception.BadRequestException;
import com.backend.jobhub.exception.ResourceNotFoundException;
import com.backend.jobhub.repository.JobApplicationRepository;
import com.backend.jobhub.repository.JobRepository;
import com.backend.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {
    
    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobService jobService;
    
    public JobApplicationDTO createApplication(CreateApplicationRequest request, String email) {
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        if (applicationRepository.existsByJobIdAndCandidateId(request.getJobId(), candidate.getId())) {
            throw new BadRequestException("You have already applied for this job.");
        }
        
        List<UploadedDocument> attachments = new ArrayList<>();
        if (request.getAttachments() != null) {
            attachments = request.getAttachments().stream()
                    .map(dto -> UploadedDocument.builder()
                            .name(dto.getName())
                            .size(dto.getSize())
                            .type(dto.getType())
                            .content(dto.getContent())
                            .build())
                    .collect(Collectors.toList());
        }
        
        JobApplication application = JobApplication.builder()
                .jobId(request.getJobId())
                .candidateId(candidate.getId())
                .candidateName(candidate.getName())
                .candidateEmail(candidate.getEmail())
                .linkedinUrl(request.getLinkedinUrl())
                .githubUrl(request.getGithubUrl())
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.received)
                .attachments(attachments)
                .build();
        
        application = applicationRepository.save(application);
        
        jobService.incrementApplicationCount(request.getJobId());
        
        return mapToDTO(application);
    }
    
    public List<JobApplicationDTO> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<JobApplicationDTO> getApplicationsByCandidate(String email) {
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return applicationRepository.findByCandidateIdOrderBySubmittedAtDesc(candidate.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<JobApplicationDTO> getApplicationsForRecruiter(String email) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<String> recruiterJobIds = jobRepository.findByCreatedBy(recruiter.getId())
                .stream()
                .map(Job::getId)
                .collect(Collectors.toList());
        
        if (recruiterJobIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return applicationRepository.findByJobIdIn(recruiterJobIds)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public JobApplicationDTO updateApplicationStatus(String applicationId, ApplicationStatus status) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setStatus(status);
        application = applicationRepository.save(application);
        
        return mapToDTO(application);
    }
    
    public UploadedDocumentDTO getDocument(String applicationId, String documentId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        UploadedDocument document = application.getAttachments().stream()
                .filter(doc -> doc.getId().equals(documentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        return UploadedDocumentDTO.builder()
                .id(document.getId())
                .name(document.getName())
                .size(document.getSize())
                .type(document.getType())
                .content(document.getContent())
                .build();
    }
    
    private JobApplicationDTO mapToDTO(JobApplication application) {
        List<UploadedDocumentDTO> attachments = new ArrayList<>();
        if (application.getAttachments() != null) {
            attachments = application.getAttachments().stream()
                    .map(doc -> UploadedDocumentDTO.builder()
                            .id(doc.getId())
                            .name(doc.getName())
                            .size(doc.getSize())
                            .type(doc.getType())
                            .build())
                    .collect(Collectors.toList());
        }
        
        return JobApplicationDTO.builder()
                .id(application.getId())
                .jobId(application.getJobId())
                .candidateId(application.getCandidateId())
                .candidateName(application.getCandidateName())
                .candidateEmail(application.getCandidateEmail())
                .linkedinUrl(application.getLinkedinUrl())
                .githubUrl(application.getGithubUrl())
                .coverLetter(application.getCoverLetter())
                .submittedAt(application.getSubmittedAt() != null ? application.getSubmittedAt().toString() : null)
                .status(application.getStatus())
                .attachments(attachments)
                .build();
    }
}
